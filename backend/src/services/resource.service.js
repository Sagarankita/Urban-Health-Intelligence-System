import pool from "../config/db.js";

export const updateResources = async (data) => {
  const { hospital_id, gen_beds, icu_beds, ventilators, status } = data;

  const result = await pool.query(
    `UPDATE resources
     SET gen_beds=$1, icu_beds=$2, ventilators=$3, status=$4
     WHERE hospital_id=$5
     RETURNING *`,
    [gen_beds, icu_beds, ventilators, status, hospital_id]
  );

  return result.rows[0];
};

export const getMunicipalData = async () => {
  const result = await pool.query(`
    SELECT 
      h.id,
      h.name,
      h.location,
      r.gen_beds,
      r.icu_beds,
      r.ventilators,
      r.status
    FROM hospitals h
    JOIN resources r ON h.id = r.hospital_id
  `);

  return result.rows;
};