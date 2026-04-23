import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(__dirname, "..", "..", "..", "pune_hospitals.csv");

let _cachedRows = null;

function parseCSV() {
  if (_cachedRows) return _cachedRows;
  const raw = readFileSync(CSV_PATH, "utf-8");
  const lines = raw.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  _cachedRows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] ?? "").trim();
    });
    return row;
  });
  return _cachedRows;
}

function insuranceColumn(insurance) {
  if (!insurance) return null;
  const val = insurance.toLowerCase().replace(/[-_\s]/g, "");
  if (val.includes("pmjay") || val === "pmj") return "accepts_pmjay";
  if (val.includes("abha")) return "accepts_abha";
  if (val.includes("private")) return "accepts_private_insurance";
  if (val.includes("noinsurance") || val.includes("none") || val === "nil")
    return "accepts_no_insurance";
  return null;
}

function scoreHospital(h) {
  const availBeds = Number(h.available_beds) || 0;
  const totalBeds = Math.max(Number(h.total_beds) || 1, 1);
  const occupancy = Number(h.occupancy_percent) || 50;
  const wait = Math.min(Number(h.wait_time_mins) || 60, 180);
  const dist = Math.min(Number(h.distance_km) || 5, 30);
  const aiScore = Number(h.ai_match_score) || 50;

  return (
    (availBeds / totalBeds) * 30 +
    ((100 - occupancy) / 100) * 30 +
    ((180 - wait) / 180) * 20 +
    ((30 - dist) / 30) * 10 +
    (aiScore / 100) * 10
  );
}

export function getRecommendations({ insurance, limit = 10 }) {
  const rows = parseCSV();
  const col = insuranceColumn(insurance);

  const filtered = col
    ? rows.filter((r) => r[col] === "True")
    : rows;

  const activeFiltered = filtered.filter(
    (r) => r.emergency_status !== "Closed"
  );

  const scored = activeFiltered.map((r) => ({
    ...r,
    _score: scoreHospital(r),
  }));

  scored.sort((a, b) => b._score - a._score);

  const seen = new Set();
  const deduped = [];
  for (const h of scored) {
    const key = `${h.hospital_name}|${h.area}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(h);
    }
    if (deduped.length >= Number(limit)) break;
  }

  return deduped.map((h) => ({
    name: h.hospital_name,
    area: h.area,
    ward: h.ward,
    type: h.hospital_type,
    department: h.department,
    available_beds: Number(h.available_beds) || 0,
    total_beds: Number(h.total_beds) || 0,
    available_icu: Number(h.available_icu) || 0,
    occupancy_percent: Number(h.occupancy_percent) || 0,
    distance_km: Number(h.distance_km) || 0,
    wait_time_mins: Number(h.wait_time_mins) || 0,
    rating: Number(h.rating) || 0,
    consultation_fee: Number(h.consultation_fee_inr) || 0,
    emergency_status: h.emergency_status,
    accepts_pmjay: h.accepts_pmjay === "True",
    accepts_abha: h.accepts_abha === "True",
    accepts_private_insurance: h.accepts_private_insurance === "True",
    accepts_no_insurance: h.accepts_no_insurance === "True",
    match_score: Math.round(h._score),
    city: h.city,
  }));
}
