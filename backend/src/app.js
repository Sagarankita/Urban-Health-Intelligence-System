import cors from "cors";
import express from "express";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import outbreakRoutes from "./routes/outbreak.routes.js";
import advisoryRoutes from "./routes/advisory.routes.js";
import geoRoutes from "./routes/geo.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ================= BASIC TEST ================= */
app.get("/", (req, res) => {
  res.send("API running!!");
});

/* ================= EXISTING FEATURE ================= */
app.post("/api/analyze", async (req, res) => {
  console.log("REQ BODY:", req.body);

  const { symptoms, duration, severity } = req.body;

  let risk = "Mild";

  if (severity > 70 || symptoms.includes("Chest Pain")) {
    risk = "Severe";
  } else if (severity > 40) {
    risk = "Moderate";
  }

  const recommendation =
    risk === "Severe"
      ? "Visit hospital immediately"
      : "Monitor symptoms and rest";

  // Also persist the report to DB (best-effort)
  try {
    const pool = (await import("./config/db.js")).default;
    await pool.query(
      `INSERT INTO reports (symptoms, severity, risk, ward, patient_name, hospital_id, status, recommendation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        JSON.stringify(symptoms),
        severity,
        risk,
        req.body.ward || "Ward 23, Pune",
        req.body.patient_name || "Anonymous Patient",
        req.body.hospital_id || 1,
        "NEW",
        recommendation,
      ]
    );
  } catch (dbErr) {
    console.log("Could not persist report to DB:", dbErr?.message);
  }

  res.json({ risk, recommendation });
});

app.get("/api/latest", async (req, res) => {
  try {
    const patientName = req.query.patient_name || null;
    let query = `SELECT risk, recommendation, severity, symptoms, created_at FROM reports ORDER BY created_at DESC LIMIT 1`;
    let params = [];
    if (patientName) {
      query = `SELECT risk, recommendation, severity, symptoms, created_at FROM reports WHERE patient_name = $1 ORDER BY created_at DESC LIMIT 1`;
      params = [patientName];
    }
    const pool = (await import("./config/db.js")).default;
    const result = await pool.query(query, params);
    if (result.rowCount > 0) {
      return res.json(result.rows[0]);
    }
    res.json({ risk: null, recommendation: null });
  } catch (e) {
    console.error("latest report error:", e?.message);
    res.json({ risk: null, recommendation: null });
  }
});

/* ================= ROUTE MODULES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/outbreaks", outbreakRoutes);
app.use("/api/advisories", advisoryRoutes);
app.use("/api/geo", geoRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);

export default app;