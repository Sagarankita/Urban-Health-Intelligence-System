import cors from "cors";
import express from "express";

// 👉 NEW: import routes
import resourceRoutes from "./routes/resource.routes.js";
import outbreakRoutes from "./routes/outbreak.routes.js";
import advisoryRoutes from "./routes/advisory.routes.js";
import geoRoutes from "./routes/geo.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ================= BASIC TEST ================= */
app.get("/", (req, res) => {
  res.send("API running!!");
});

/* ================= EXISTING FEATURE ================= */
app.post("/api/analyze", (req, res) => {
  console.log("REQ BODY:", req.body);

  const { symptoms, duration, severity } = req.body;

  let risk = "Mild";

  if (severity > 70 || symptoms.includes("Chest Pain")) {
    risk = "Severe";
  } else if (severity > 40) {
    risk = "Moderate";
  }

  res.json({
    risk,
    recommendation:
      risk === "Severe"
        ? "Visit hospital immediately"
        : "Monitor symptoms and rest",
  });
});

app.get("/api/latest", (req, res) => {
  res.json({
    risk: "Moderate",
    recommendation: "Monitor symptoms and rest",
  });
});

/* ================= NEW RESOURCE SYSTEM ================= */

// 👉 all resource routes go here
app.use("/api/resources", resourceRoutes);
app.use("/api/outbreaks", outbreakRoutes);
app.use("/api/advisories", advisoryRoutes);
app.use("/api/geo", geoRoutes);
/*
Now available:
POST /api/resources/update
GET  /api/resources/municipal
*/

export default app;