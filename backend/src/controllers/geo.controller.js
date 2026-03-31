import pool from "../config/db.js";

export const listCities = async (req, res) => {
  try {
    const state = (req.query?.state || "Maharashtra").toString();
    const result = await pool.query(
      `SELECT id, state, name FROM cities WHERE state=$1 ORDER BY name ASC`,
      [state]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("listCities error:", e);
    res.status(500).json({ error: "Failed to list cities" });
  }
};

export const listWardsByCity = async (req, res) => {
  try {
    const cityId = Number(req.params.cityId);
    if (!Number.isFinite(cityId)) {
      return res.status(400).json({ error: "Invalid cityId" });
    }

    const result = await pool.query(
      `SELECT id, city_id, name FROM wards WHERE city_id=$1 ORDER BY name ASC`,
      [cityId]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("listWardsByCity error:", e);
    res.status(500).json({ error: "Failed to list wards" });
  }
};

