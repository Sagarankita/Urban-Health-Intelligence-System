import express from "express";
import {
  updateResourcesController,
  getMunicipalController,
} from "../controllers/resource.controller.js";

const router = express.Router();

router.post("/update", updateResourcesController);
router.get("/municipal", getMunicipalController);

export default router;