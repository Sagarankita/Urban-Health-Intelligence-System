import pool from "../config/db.js";

/**
 * GET /api/hospitals
 * List all hospitals with their resource info.
 */
export const listHospitals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.id, h.name, h.location,
        r.gen_beds, r.icu_beds, r.ventilators, r.status
      FROM hospitals h
      LEFT JOIN resources r ON h.id = r.hospital_id
      ORDER BY h.id
    `);
    res.json(result.rows);
  } catch (e) {
    console.error("listHospitals error:", e);
    res.status(500).json({ error: "Failed to list hospitals" });
  }
};

/**
 * GET /api/hospitals/enriched
 * List hospitals with real computed metrics (wait time, load, type) for find-hospital screen.
 */
export const listHospitalsEnriched = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        h.id, h.name, h.location,
        r.gen_beds, r.icu_beds, r.ventilators, r.status,
        COALESCE(appt_counts.today_count, 0) AS today_appointments,
        COALESCE(appt_counts.pending_count, 0) AS pending_appointments
      FROM hospitals h
      LEFT JOIN resources r ON h.id = r.hospital_id
      LEFT JOIN (
        SELECT hospital_id,
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE) AS today_count,
          COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND status = 'PENDING') AS pending_count
        FROM appointments
        GROUP BY hospital_id
      ) appt_counts ON h.id = appt_counts.hospital_id
      ORDER BY h.id
    `);

    const enriched = result.rows.map((h) => {
      // Compute wait from pending appointments (~10 mins per pending appointment)
      const waitMins = Math.max(5, (h.pending_appointments || 0) * 10);
      // Compute load from status + bed count
      let load = "low";
      if (h.status === "CLOSED") load = "high";
      else if (h.status === "LIMITED" || (h.gen_beds !== null && h.gen_beds < 10)) load = "high";
      else if (h.gen_beds !== null && h.gen_beds < 30) load = "medium";
      // Type from total beds
      const totalBeds = (h.gen_beds || 0) + (h.icu_beds || 0);
      let type = "Primary Care";
      if (totalBeds > 100) type = "Multi-Specialty";
      else if (totalBeds > 40) type = "General Hospital";
      // Match factor: higher beds & lower load = better match
      const match = Math.min(98, Math.max(60, 90 - (h.pending_appointments || 0) * 2 + (h.gen_beds || 0) / 5));

      return {
        ...h,
        wait: `${waitMins} mins`,
        load,
        type,
        match: Math.round(match),
        dept: "General Medicine",
      };
    });

    res.json(enriched);
  } catch (e) {
    console.error("listHospitalsEnriched error:", e);
    res.status(500).json({ error: "Failed to list hospitals" });
  }
};

/**
 * GET /api/hospitals/:id
 * Single hospital with resources.
 */
export const getHospital = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query(
      `SELECT
        h.id, h.name, h.location,
        r.gen_beds, r.icu_beds, r.ventilators, r.status
      FROM hospitals h
      LEFT JOIN resources r ON h.id = r.hospital_id
      WHERE h.id = $1`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Hospital not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("getHospital error:", e);
    res.status(500).json({ error: "Failed to get hospital" });
  }
};

/**
 * GET /api/hospitals/:id/stats
 * Dashboard statistics for the hospital portal.
 */
export const getHospitalStats = async (req, res) => {
  try {
    const hospitalId = Number(req.params.id);
    if (!Number.isFinite(hospitalId))
      return res.status(400).json({ error: "Invalid id" });

    // Parallel queries
    const [appointmentsRes, reportsRes, resourcesRes, doctorsRes] =
      await Promise.all([
        pool.query(
          `SELECT
            COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE) AS today_total,
            COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND status = 'PENDING') AS today_pending,
            COUNT(*) FILTER (WHERE appointment_date = CURRENT_DATE AND status = 'APPROVED') AS today_approved
          FROM appointments WHERE hospital_id = $1`,
          [hospitalId]
        ),
        pool.query(
          `SELECT
            COUNT(*) FILTER (WHERE status = 'NEW') AS new_reports,
            COUNT(*) AS total_reports
          FROM reports WHERE hospital_id = $1`,
          [hospitalId]
        ),
        pool.query(
          `SELECT gen_beds, icu_beds, ventilators, status
          FROM resources WHERE hospital_id = $1`,
          [hospitalId]
        ),
        pool.query(
          `SELECT COUNT(*) AS total_doctors FROM doctors WHERE hospital_id = $1`,
          [hospitalId]
        ),
      ]);

    const appt = appointmentsRes.rows[0] || {};
    const rpt = reportsRes.rows[0] || {};
    const resource = resourcesRes.rows[0] || {};
    const doc = doctorsRes.rows[0] || {};

    res.json({
      today_appointments: Number(appt.today_total) || 0,
      pending_appointments: Number(appt.today_pending) || 0,
      approved_appointments: Number(appt.today_approved) || 0,
      incoming_reports: Number(rpt.new_reports) || 0,
      total_reports: Number(rpt.total_reports) || 0,
      gen_beds: resource.gen_beds ?? 0,
      icu_beds: resource.icu_beds ?? 0,
      ventilators: resource.ventilators ?? 0,
      status: resource.status ?? "ACTIVE",
      total_doctors: Number(doc.total_doctors) || 0,
    });
  } catch (e) {
    console.error("getHospitalStats error:", e);
    res.status(500).json({ error: "Failed to fetch hospital stats" });
  }
};

/**
 * GET /api/hospitals/:id/doctors
 * List doctors for a hospital.
 */
export const listDoctors = async (req, res) => {
  try {
    const hospitalId = Number(req.params.id);
    if (!Number.isFinite(hospitalId))
      return res.status(400).json({ error: "Invalid id" });

    const result = await pool.query(
      `SELECT id, name, department, specialization, available
       FROM doctors WHERE hospital_id = $1 ORDER BY department, name`,
      [hospitalId]
    );
    res.json(result.rows);
  } catch (e) {
    console.error("listDoctors error:", e);
    res.status(500).json({ error: "Failed to list doctors" });
  }
};
