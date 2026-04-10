import express from "express";
import {
  getHospital,
  getHospitalStats,
  listDoctors,
  listHospitals,
  listHospitalsEnriched,
} from "../controllers/hospital.controller.js";

const router = express.Router();

router.get("/", listHospitals);
router.get("/enriched", listHospitalsEnriched);
router.get("/:id", getHospital);
router.get("/:id/stats", getHospitalStats);
router.get("/:id/doctors", listDoctors);

export default router;
