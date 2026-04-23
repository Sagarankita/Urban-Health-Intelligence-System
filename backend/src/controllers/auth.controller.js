import pool from "../config/db.js";

export const register = async (req, res) => {
  try {
    const {
      name, email, password, role,
      phone, ward, insurance, abha, hospital_id, age, gender,
    } = req.body || {};

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "name, email, password, and role are required" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, phone, ward, insurance, abha, hospital_id, age, gender)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, name, email, role, phone, ward, insurance, abha, hospital_id, age, gender`,
      [
        name, email, password, role.toUpperCase(),
        phone || null, ward || null, insurance || null, abha || null,
        hospital_id ? Number(hospital_id) : null,
        age || null, gender || null,
      ]
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (e) {
    console.error("register error:", e);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const result = await pool.query(
      `SELECT id, name, email, password, role, phone, ward, insurance,
              abha, insurance_id, allergies, medical_history, hospital_id, age, gender
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (role && user.role !== role.toUpperCase()) {
      return res.status(401).json({
        error: `This account is registered as ${user.role}. Please select the correct role.`,
      });
    }

    const { password: _pw, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Login failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      id, name, ward, insurance, abha, insurance_id,
      allergies, medical_history, age, gender, phone,
    } = req.body || {};

    if (!id) return res.status(400).json({ error: "id is required" });

    const result = await pool.query(
      `UPDATE users
       SET name=$1, ward=$2, insurance=$3, abha=$4, insurance_id=$5,
           allergies=$6, medical_history=$7, age=$8, gender=$9, phone=$10
       WHERE id=$11
       RETURNING id, name, email, role, phone, ward, insurance, abha,
                 insurance_id, allergies, medical_history, age, gender, hospital_id`,
      [name, ward, insurance, abha, insurance_id, allergies, medical_history, age, gender, phone, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });

    res.json({ success: true, user: result.rows[0] });
  } catch (e) {
    console.error("updateProfile error:", e);
    res.status(500).json({ error: "Profile update failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, phone, new_password } = req.body || {};

    if (!email || !phone || !new_password) {
      return res.status(400).json({ error: "email, phone, and new_password are required" });
    }

    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND phone = $2",
      [email, phone]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No account found with that email and phone combination" });
    }

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      new_password,
      result.rows[0].id,
    ]);

    res.json({ success: true, message: "Password reset successful" });
  } catch (e) {
    console.error("resetPassword error:", e);
    res.status(500).json({ error: "Password reset failed" });
  }
};
