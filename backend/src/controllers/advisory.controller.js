import pool from "../config/db.js";

export const createAdvisory = async (req, res) => {
  try {
    const { message, target_area, city_id, ward_id } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    const cityId = city_id != null ? Number(city_id) : null;
    const wardId = ward_id != null ? Number(ward_id) : null;

    // Try to derive a human-readable target_area if ids are provided.
    let derivedTargetArea = target_area ? String(target_area).trim() : null;
    if (!derivedTargetArea && Number.isFinite(wardId)) {
      const w = await pool.query(`SELECT name FROM wards WHERE id=$1`, [wardId]);
      derivedTargetArea = w.rows?.[0]?.name || null;
    }
    if (!derivedTargetArea && Number.isFinite(cityId)) {
      const c = await pool.query(`SELECT name FROM cities WHERE id=$1`, [cityId]);
      derivedTargetArea = c.rows?.[0]?.name || null;
    }

    const result = await pool.query(
      `INSERT INTO advisories (message, target_area, city_id, ward_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        String(message).trim(),
        derivedTargetArea,
        Number.isFinite(cityId) ? cityId : null,
        Number.isFinite(wardId) ? wardId : null,
      ]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.error("createAdvisory error:", e);
    res.status(500).json({ error: "Failed to create advisory" });
  }
};

export const listAdvisories = async (req, res) => {
  try {
    const { target_area, city_id, ward_id, limit } = req.query || {};
    const lim = Math.min(Number(limit) || 20, 100);

    const cityId = city_id != null ? Number(city_id) : null;
    const wardId = ward_id != null ? Number(ward_id) : null;

    // Base query includes joined names for UI convenience.
    const baseSelect = `
      SELECT
        a.*,
        c.name AS city_name,
        w.name AS ward_name
      FROM advisories a
      LEFT JOIN cities c ON a.city_id = c.id
      LEFT JOIN wards w ON a.ward_id = w.id
    `;

    // If target_area is provided, return advisories for that ward/area AND global advisories (NULL / 'All').
    if (target_area && String(target_area).trim()) {
      const t = String(target_area).trim();
      const result = await pool.query(
        `
        ${baseSelect}
        WHERE
          a.target_area = $1
          OR w.name = $1
          OR c.name = $1
          OR a.target_area IS NULL
          OR lower(a.target_area) IN ('all', 'all pune citizens', 'pune')
        ORDER BY created_at DESC
        LIMIT $2
        `,
        [t, lim]
      );
      return res.json(result.rows);
    }

    if (Number.isFinite(wardId)) {
      // Include: ward-specific advisories + city-wide advisories for ward's city + global advisories.
      const wardCity = await pool.query(`SELECT city_id FROM wards WHERE id=$1`, [wardId]);
      const wardCityId = wardCity.rows?.[0]?.city_id ?? null;

      const params = [wardId, lim];
      let whereSql = `
        (a.ward_id = $1)
        OR (a.city_id IS NULL AND a.ward_id IS NULL)
      `;

      if (wardCityId != null) {
        params.splice(1, 0, wardCityId); // [wardId, wardCityId, lim]
        whereSql = `
          (a.ward_id = $1)
          OR (a.city_id = $2 AND a.ward_id IS NULL)
          OR (a.city_id IS NULL AND a.ward_id IS NULL)
        `;
      }

      const result = await pool.query(
        `
        ${baseSelect}
        WHERE ${whereSql}
        ORDER BY a.created_at DESC
        LIMIT $${params.length}
        `,
        params
      );
      return res.json(result.rows);
    }

    if (Number.isFinite(cityId)) {
      const result = await pool.query(
        `
        ${baseSelect}
        WHERE (a.city_id = $1 AND a.ward_id IS NULL)
           OR (a.city_id IS NULL AND a.ward_id IS NULL)
        ORDER BY a.created_at DESC
        LIMIT $2
        `,
        [cityId, lim]
      );
      return res.json(result.rows);
    }

    const result = await pool.query(
      `
      ${baseSelect}
      ORDER BY created_at DESC
      LIMIT $1
      `,
      [lim]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("listAdvisories error:", e);
    res.status(500).json({ error: "Failed to list advisories" });
  }
};

// Alias: `/api/advisories/:area`
export const getAdvisoriesByArea = async (req, res) => {
  req.query = { ...(req.query || {}), target_area: req.params.area };
  return listAdvisories(req, res);
};

export const deleteAdvisory = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const result = await pool.query(`DELETE FROM advisories WHERE id=$1 RETURNING *`, [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, deleted: result.rows[0] });
  } catch (e) {
    console.error("deleteAdvisory error:", e);
    res.status(500).json({ error: "Failed to delete advisory" });
  }
};