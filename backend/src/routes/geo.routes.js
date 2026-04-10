import express from "express";
import { listCities, listWardsByCity } from "../controllers/geo.controller.js";

const router = express.Router();

router.get("/cities", listCities);
router.get("/cities/:cityId/wards", listWardsByCity);

export default router;

