import express from "express";
import {
  createAdvisory,
  deleteAdvisory,
  getAdvisoriesByArea,
  listAdvisories,
} from "../controllers/advisory.controller.js";

const router = express.Router();

router.get("/", listAdvisories);
router.get("/:area", getAdvisoriesByArea);
router.post("/", createAdvisory);
router.delete("/:id", deleteAdvisory);

export default router;