import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const persistModelOutput = async (result) => {
  const all = Array.isArray(result?.all_wards) ? result.all_wards : [];
  const top = Array.isArray(result?.top_hotspots) ? result.top_hotspots : [];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Replace latest snapshot (simple + predictable for UI/admin queries).
    await client.query("TRUNCATE outbreaks RESTART IDENTITY");
    await client.query("TRUNCATE advisories RESTART IDENTITY");

    for (const w of all) {
      await client.query(
        `
        INSERT INTO outbreaks (ward, zone, outbreak_prob, z_score, growth_48h, cases, syndrome)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          w?.ward ?? null,
          w?.zone ?? null,
          w?.outbreak_prob ?? null,
          w?.z_score ?? null,
          w?.growth_48h_pct ?? null,
          w?.actual ?? null,
          w?.syndrome ?? null,
        ]
      );
    }

    // Store advisories for top hotspots (maps cleanly to current `advisories` table).
    for (const w of top) {
      const targetArea = w?.ward ?? null;
      const msgs = Array.isArray(w?.advisories) ? w.advisories : [];
      for (const msg of msgs) {
        await client.query(
          `INSERT INTO advisories (message, target_area) VALUES ($1,$2)`,
          [msg, targetArea]
        );
      }
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

export const getOutbreaks = async (req, res) => {
  try {
    // Try database first, fallback to mock data
    try {
      const result = await pool.query(
        "SELECT * FROM outbreaks ORDER BY outbreak_prob DESC"
      );
      return res.json(result.rows);
    } catch (dbError) {
      console.log("Database not available, using mock data for outbreaks");
      return res.json([
        {
          id: 1,
          ward: "Ward 1 - Shivajinagar",
          zone: "RED",
          outbreak_prob: 77.7,
          z_score: 1.246,
          growth_48h: 3.4,
          cases: 80,
          syndrome: "respiratory",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          ward: "Ward 2 - Kothrud",
          zone: "RED",
          outbreak_prob: 75.0,
          z_score: 1.101,
          growth_48h: 7.0,
          cases: 46,
          syndrome: "respiratory",
          created_at: new Date().toISOString()
        }
      ]);
    }
  } catch (error) {
    console.error("Error fetching outbreaks:", error);
    res.status(500).json({ error: "Failed to fetch outbreaks" });
  }
};

export const getWardStats = async (req, res) => {
  try {
    // Try database first, fallback to mock data
    try {
      const result = await pool.query("SELECT * FROM ward_stats");
      return res.json(result.rows);
    } catch (dbError) {
      console.log("Database not available, using mock data for ward stats");
      return res.json([
        {
          id: 1,
          ward: "Ward 1 - Shivajinagar",
          risk_level: "HIGH",
          score: 85,
          trend: "+18% increase",
          top_symptoms: ["Fever", "Cough", "Headache"],
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          ward: "Ward 2 - Kothrud",
          risk_level: "MEDIUM",
          score: 58,
          trend: "Stable trend",
          top_symptoms: ["Cough", "Fatigue"],
          created_at: new Date().toISOString()
        }
      ]);
    }
  } catch (error) {
    console.error("Error fetching ward stats:", error);
    res.status(500).json({ error: "Failed to fetch ward stats" });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    console.log("Starting Python process for heatmap data...");

    // Run Python script to get AI-processed data
    const pythonProcess = spawn("py", [
      path.join(__dirname, "../../models/untitled10.py"),
      "--get-data"
    ], {
      cwd: path.join(__dirname, "../.."),
      stdio: ["pipe", "pipe", "pipe"],
      // Ensure child process inherits DB_* variables for `models/untitled10.py`.
      env: process.env
    });

    let data = "";
    let error = "";

    pythonProcess.stdout.on("data", (chunk) => {
      console.log("Python stdout:", chunk.toString());
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      console.log("Python stderr:", chunk.toString());
      error += chunk.toString();
    });

    pythonProcess.on("close", (code) => {
      console.log("Python exit code:", code);

      if (code !== 0) {
        console.error("Python script error:", error);
        // Fallback to mock data if Python fails
        console.log("Falling back to mock data...");
        return res.json(getMockHeatmapData());
      }

      try {
        console.log("Raw data from Python:", data);
        const result = JSON.parse(data);
        // Persist to DB (best-effort; don't block response on DB issues)
        persistModelOutput(result).catch((e) => {
          console.error("Failed to persist model output:", e?.message || e);
        });
        res.json(result);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        // Fallback to mock data if parsing fails
        console.log("Falling back to mock data due to parse error...");
        return res.json(getMockHeatmapData());
      }
    });

    // Set a timeout for the Python process
    setTimeout(() => {
      pythonProcess.kill();
      console.log("Python process timed out, using mock data...");
      res.json(getMockHeatmapData());
    }, 30000); // 30 second timeout

  } catch (error) {
    console.error("Error in getHeatmapData:", error);
    // Fallback to mock data
    console.log("Exception occurred, using mock data...");
    res.json(getMockHeatmapData());
  }
};

export const refreshHeatmapData = async (req, res) => {
  // Reuse the same handler; this endpoint exists for explicit refresh triggers.
  return getHeatmapData(req, res);
};

// Mock data function for fallback
const getMockHeatmapData = () => {
  return {
    zone_summary: {
      RED: ["Ward 1 - Shivajinagar", "Ward 2 - Kothrud"],
      YELLOW: ["Ward 3 - Aundh"],
      GREEN: []
    },
    top_symptoms: [
      { name: "Fever", value: 78 },
      { name: "Cough", value: 65 },
      { name: "Headache", value: 52 },
      { name: "Body Ache", value: 41 }
    ],
    ward_symptoms: {
      "Ward 1 - Shivajinagar": ["Fever", "Cough", "Shortness of Breath"],
      "Ward 2 - Kothrud": ["Fever", "Cough", "Shortness of Breath"],
      "Ward 3 - Aundh": ["Nausea", "Vomiting", "Diarrhea"]
    },
    top_hotspots: [
      {
        ward: "Ward 1 - Shivajinagar",
        zone: "RED",
        outbreak_prob: 77.7,
        hotspot_score: 65.85,
        actual: 80,
        syndrome: "respiratory",
        growth_48h_pct: 3.4,
        wow_growth_pct: 24.3,
        advisories: [
          "[URGENT] Activate district outbreak response team",
          "[URGENT] Alert District Health Officer and CMO immediately",
          "Increase OPD capacity by 40% in affected wards"
        ]
      },
      {
        ward: "Ward 2 - Kothrud",
        zone: "RED",
        outbreak_prob: 75.0,
        hotspot_score: 57.34,
        actual: 46,
        syndrome: "respiratory",
        growth_48h_pct: 7.0,
        wow_growth_pct: 24.4,
        advisories: [
          "[URGENT] Activate district outbreak response team",
          "[URGENT] Alert District Health Officer and CMO immediately"
        ]
      },
      {
        ward: "Ward 3 - Aundh",
        zone: "YELLOW",
        outbreak_prob: 61.1,
        hotspot_score: 48.06,
        actual: 58,
        syndrome: "gastrointestinal",
        growth_48h_pct: -0.8,
        wow_growth_pct: 18.1,
        advisories: [
          "Elevate monitoring to daily case review",
          "Pre-stock medications, ORS, and IV fluids at PHCs"
        ]
      }
    ],
    all_wards: [
      {
        ward: "Ward 1 - Shivajinagar",
        zone: "RED",
        outbreak_prob: 77.7,
        hotspot_score: 65.85,
        actual: 80
      },
      {
        ward: "Ward 2 - Kothrud",
        zone: "RED",
        outbreak_prob: 75.0,
        hotspot_score: 57.34,
        actual: 46
      },
      {
        ward: "Ward 3 - Aundh",
        zone: "YELLOW",
        outbreak_prob: 61.1,
        hotspot_score: 48.06,
        actual: 58
      }
    ],
    timestamp: new Date().toISOString()
  };
};