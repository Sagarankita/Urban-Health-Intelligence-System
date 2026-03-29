import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running!!");
});

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

export default app;