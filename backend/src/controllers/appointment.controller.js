import pool from "../config/db.js";

/**
 * GET /api/appointments?hospital_id=&status=&date=
 */
export const listAppointments = async (req, res) => {
  try {
    const { hospital_id, status, date, limit, patient_name } = req.query || {};
    const lim = Math.min(Number(limit) || 50, 200);

    const conditions = [];
    const params = [];
    let idx = 1;

    if (hospital_id) {
      conditions.push(`a.hospital_id = $${idx++}`);
      params.push(Number(hospital_id));
    }
    if (patient_name) {
      conditions.push(`a.patient_name ILIKE $${idx++}`);
      params.push(patient_name);
    }
    if (status) {
      conditions.push(`a.status = $${idx++}`);
      params.push(status.toUpperCase());
    }
    if (date) {
      conditions.push(`a.appointment_date = $${idx++}`);
      params.push(date);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT
        a.*,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        h.name AS hospital_name
      FROM appointments a
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN hospitals h ON a.hospital_id = h.id
      ${where}
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
      LIMIT $${idx}`,
      [...params, lim],
    );
    res.json(result.rows);
  } catch (e) {
    console.error("listAppointments error:", e);
    res.status(500).json({ error: "Failed to list appointments" });
  }
};

/**
 * POST /api/appointments
 * Create a new appointment.
 */
export const createAppointment = async (req, res) => {
  try {
    const {
      patient_name,
      department,
      doctor_id,
      hospital_id,
      appointment_date,
      appointment_time,
      insurance,
      priority,
      notes,
    } = req.body;

    if (
      !patient_name ||
      !department ||
      !hospital_id ||
      !appointment_date ||
      !appointment_time
    ) {
      return res
        .status(400)
        .json({
          error:
            "patient_name, department, hospital_id, appointment_date, appointment_time are required",
        });
    }

    const result = await pool.query(
      `INSERT INTO appointments
        (patient_name, department, doctor_id, hospital_id, appointment_date, appointment_time, insurance, priority, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        patient_name,
        department,
        doctor_id || null,
        hospital_id,
        appointment_date,
        appointment_time,
        insurance || null,
        priority || "NORMAL",
        notes || null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error("createAppointment error:", e);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status (approve, cancel, reschedule).
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const { status, appointment_date, appointment_time, notes } = req.body;
    const validStatuses = [
      "PENDING",
      "APPROVED",
      "RESCHEDULED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${validStatuses.join(", ")}` });
    }

    // Build dynamic SET clause
    const sets = ["status = $1", "updated_at = NOW()"];
    const params = [status.toUpperCase()];
    let idx = 2;

    if (appointment_date) {
      sets.push(`appointment_date = $${idx++}`);
      params.push(appointment_date);
    }
    if (appointment_time) {
      sets.push(`appointment_time = $${idx++}`);
      params.push(appointment_time);
    }
    if (notes !== undefined) {
      sets.push(`notes = $${idx++}`);
      params.push(notes);
    }

    params.push(id);
    const result = await pool.query(
      `UPDATE appointments SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
      params,
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Appointment not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("updateAppointmentStatus error:", e);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

/**
 * GET /api/appointments/summary?hospital_id=
 * Summary counts for a hospital.
 */
export const appointmentSummary = async (req, res) => {
  try {
    const hospitalId = Number(req.query.hospital_id);
    const where = Number.isFinite(hospitalId) ? `WHERE hospital_id = $1` : "";
    const params = Number.isFinite(hospitalId) ? [hospitalId] : [];

    const result = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'PENDING')    AS pending,
        COUNT(*) FILTER (WHERE status = 'APPROVED')   AS approved,
        COUNT(*) FILTER (WHERE status = 'CANCELLED')  AS cancelled,
        COUNT(*) FILTER (WHERE status = 'COMPLETED')  AS completed,
        COUNT(*) FILTER (WHERE status = 'RESCHEDULED') AS rescheduled,
        COUNT(*) AS total
      FROM appointments ${where}`,
      params,
    );
    res.json(result.rows[0]);
  } catch (e) {
    console.error("appointmentSummary error:", e);
    res.status(500).json({ error: "Failed to get summary" });
  }
};
