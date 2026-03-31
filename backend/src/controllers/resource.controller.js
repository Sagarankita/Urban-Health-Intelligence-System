import {
  updateResources,
  getMunicipalData,
} from "../services/resource.service.js";

export const updateResourcesController = async (req, res) => {
  try {
    const data = await updateResources(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

export const getMunicipalController = async (req, res) => {
  try {
    const data = await getMunicipalData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};