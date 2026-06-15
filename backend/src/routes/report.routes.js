import express from "express";
import {
  listReports,
  reportsSummary,
  toggleCritical,
  updateReportStatus,
} from "../controllers/report.controller.js";

const router = express.Router();

router.get("/", listReports);
router.get("/summary", reportsSummary);
router.patch("/:id/critical", toggleCritical);
router.patch("/:id/status", updateReportStatus);

export default router;
