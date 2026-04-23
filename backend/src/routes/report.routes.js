import express from "express";
import {
    listReports,
    recommendVisit,
    reportsSummary,
    symptomsSummary,
    toggleCritical,
    updateReportStatus,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/", listReports);
router.get("/summary", reportsSummary);
router.get("/symptoms", symptomsSummary);
router.patch("/:id/critical", toggleCritical);
router.patch("/:id/status", updateReportStatus);
router.patch("/:id/recommend", recommendVisit);

export default router;
