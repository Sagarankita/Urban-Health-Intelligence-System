import express from "express";
import {
  appointmentSummary,
  createAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", listAppointments);
router.get("/summary", appointmentSummary);
router.post("/", createAppointment);
router.patch("/:id/status", updateAppointmentStatus);

export default router;
