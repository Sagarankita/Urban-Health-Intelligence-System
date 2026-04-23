import pool from "../config/db.js";

/**
 * GET /api/reports?hospital_id=&status=&limit=
 * List patient reports for hospital review.
 */
export const listReports = async (req, res) => {
  try {
    const { hospital_id, status, limit, patient_name } = req.query || {};
    const lim = Math.min(Number(limit) || 30, 100);

    const conditions = [];
    const params = [];
    let idx = 1;

    if (hospital_id) {
      conditions.push(`hospital_id = $${idx++}`);
      params.push(Number(hospital_id));
    }
    if (patient_name) {
      conditions.push(`patient_name ILIKE $${idx++}`);
      params.push(patient_name);
    }
    if (status) {
      conditions.push(`status = $${idx++}`);
      params.push(status.toUpperCase());
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT
        id, patient_name, symptoms, severity, risk, ward,
        hospital_id, is_critical, status, recommendation, recommendation_message, created_at
      FROM reports
      ${where}
      ORDER BY
        CASE WHEN is_critical = true THEN 0 ELSE 1 END,
        CASE WHEN status = 'NEW' THEN 0 ELSE 1 END,
        created_at DESC
      LIMIT $${idx}`,
      [...params, lim],
    );
    res.json(result.rows);
  } catch (e) {
    console.error("listReports error:", e);
    res.status(500).json({ error: "Failed to list reports" });
  }
};

/**
 * PATCH /api/reports/:id/critical
 * Mark / unmark a report as critical.
 */
export const toggleCritical = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const { is_critical } = req.body;

    const result = await pool.query(
      `UPDATE reports SET is_critical = $1, status = 'REVIEWED' WHERE id = $2 RETURNING *`,
      [is_critical === true || is_critical === "true", id],
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Report not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("toggleCritical error:", e);
    res.status(500).json({ error: "Failed to update report" });
  }
};

/**
 * PATCH /api/reports/:id/status
 * Update report status (NEW, REVIEWED, ACKNOWLEDGED).
 */
export const updateReportStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status is required" });

    const result = await pool.query(
      `UPDATE reports SET status = $1 WHERE id = $2 RETURNING *`,
      [status.toUpperCase(), id],
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Report not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("updateReportStatus error:", e);
    res.status(500).json({ error: "Failed to update report status" });
  }
};

/**
 * PATCH /api/reports/:id/recommend
 * Hospital sets a recommendation message for the patient.
 * Sets status = ACKNOWLEDGED and saves the message.
 */
export const recommendVisit = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const { message } = req.body;
    if (!message || !String(message).trim())
      return res.status(400).json({ error: "message is required" });

    const result = await pool.query(
      `UPDATE reports
       SET status = 'ACKNOWLEDGED', recommendation_message = $1
       WHERE id = $2
       RETURNING *`,
      [String(message).trim(), id],
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Report not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("recommendVisit error:", e);
    res.status(500).json({ error: "Failed to set recommendation" });
  }
};

/**
 * GET /api/reports/symptoms?limit=
 * Top symptoms across all patient reports (for municipal dashboard).
 */
export const symptomsSummary = async (req, res) => {
  try {
    const lim = Math.min(Number(req.query.limit) || 10, 30);
    const result = await pool.query(
      `SELECT symptom, COUNT(*) AS count
       FROM (
         SELECT jsonb_array_elements_text(symptoms) AS symptom
         FROM reports
         WHERE jsonb_typeof(symptoms) = 'array' AND patient_name IS NOT NULL
         UNION ALL
         SELECT jsonb_object_keys(symptoms) AS symptom
         FROM reports
         WHERE jsonb_typeof(symptoms) = 'object' AND patient_name IS NOT NULL
       ) s
       GROUP BY symptom
       ORDER BY count DESC
       LIMIT $1`,
      [lim],
    );
    res.json(result.rows);
  } catch (e) {
    console.error("symptomsSummary error:", e);
    res.status(500).json({ error: "Failed to get symptoms summary" });
  }
};

/**
 * GET /api/reports/summary?hospital_id=
 * Summary counts for reports dashboard.
 */
export const reportsSummary = async (req, res) => {
  try {
    const hospitalId = Number(req.query.hospital_id);
    const where = Number.isFinite(hospitalId) ? `WHERE hospital_id = $1` : "";
    const params = Number.isFinite(hospitalId) ? [hospitalId] : [];

    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'NEW')         AS new_reports,
        COUNT(*) FILTER (WHERE status = 'REVIEWED')    AS reviewed,
        COUNT(*) FILTER (WHERE is_critical = true)     AS critical,
        COUNT(*) AS total
      FROM reports ${where}`,
      params,
    );
    res.json(result.rows[0]);
  } catch (e) {
    console.error("reportsSummary error:", e);
    res.status(500).json({ error: "Failed to get summary" });
  }
};
