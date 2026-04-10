import express from "express";
import {
  getHospital,
  getHospitalStats,
  listDoctors,
  listHospitals,
} from "../controllers/hospital.controller.js";

const router = express.Router();

router.get("/", listHospitals);
router.get("/:id", getHospital);
router.get("/:id/stats", getHospitalStats);
router.get("/:id/doctors", listDoctors);

export default router;
