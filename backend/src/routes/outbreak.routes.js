import express from "express";
import { getHeatmapData, getOutbreaks, getWardStats, refreshHeatmapData } from "../controllers/outbreak.controller.js";

const router = express.Router();

router.get("/", getOutbreaks);
router.get("/heatmap", getHeatmapData);
router.get("/ward-stats", getWardStats);
router.post("/refresh", refreshHeatmapData);

export default router;