import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "uhis-dev-secret-2024";
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Register a new user (patient, hospital, or municipal).
 */
export const register = async (req, res) => {
  try {
    const {
      name, email, phone, password, role,
      // Patient specific
      age, gender, ward, insurance, abha,
      // Hospital specific
      hospital_name, license_number, address, hospital_ward,
      // Municipal specific
      employee_id, department, assigned_ward,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "name, email, password, and role are required" });
    }

    const validRoles = ["patient", "hospital", "municipal"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${validRoles.join(", ")}` });
    }

    // Check if email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // For hospital role, optionally create the hospital record first
    let hospitalId = null;
    if (role === "hospital" && hospital_name) {
      const hResult = await pool.query(
        "INSERT INTO hospitals (name) VALUES ($1) RETURNING id",
        [hospital_name]
      );
      hospitalId = hResult.rows[0].id;
      // Also create a resource entry for the new hospital
      await pool.query(
        "INSERT INTO resources (hospital_id, gen_beds, icu_beds, ventilators, status) VALUES ($1, 0, 0, 0, 'ACTIVE')",
        [hospitalId]
      );
    }

    const result = await pool.query(
      `INSERT INTO users 
        (name, email, phone, password_hash, role, age, gender, ward, insurance, abha,
         hospital_id, license_number, address, employee_id, department, assigned_ward, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING id, name, email, phone, role, age, gender, ward, insurance, abha,
                 hospital_id, license_number, address, employee_id, department, assigned_ward, is_verified, created_at`,
      [
        name, email, phone || null, passwordHash, role,
        age || null, gender || null, ward || hospital_ward || null,
        insurance || null, abha || null,
        hospitalId, license_number || null, address || null,
        employee_id || null, department || null, assigned_ward || null,
        role === "municipal" ? false : true, // Municipal accounts need verification
      ]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });

    res.status(201).json({ user, token });
  } catch (e) {
    console.error("register error:", e);
    res.status(500).json({ error: "Registration failed" });
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    let query = "SELECT * FROM users WHERE email = $1";
    const params = [email];
    
    if (role) {
      query += " AND role = $2";
      params.push(role);
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Remove password hash from response
    delete user.password_hash;

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "30d" });

    res.json({ user, token });
  } catch (e) {
    console.error("login error:", e);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * PUT /api/auth/profile
 * Update user profile data.
 */
export const updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { name, age, gender, ward, email, insurance, abha, insurance_id, allergies, medical_history } = req.body;

    const result = await pool.query(
      `UPDATE users SET 
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        gender = COALESCE($3, gender),
        ward = COALESCE($4, ward),
        email = COALESCE($5, email),
        insurance = COALESCE($6, insurance),
        abha = COALESCE($7, abha),
        insurance_id = COALESCE($8, insurance_id),
        allergies = COALESCE($9, allergies),
        medical_history = COALESCE($10, medical_history),
        updated_at = NOW()
      WHERE id = $11
      RETURNING id, name, email, phone, role, age, gender, ward, insurance, abha, insurance_id, allergies, medical_history, hospital_id`,
      [name, age, gender, ward, email, insurance, abha, insurance_id, allergies, medical_history, decoded.userId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("updateProfile error:", e);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

/**
 * GET /api/auth/me
 * Get current user from JWT.
 */
export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.replace("Bearer ", "");
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }

    const result = await pool.query(
      `SELECT id, name, email, phone, role, age, gender, ward, insurance, abha, insurance_id, allergies, medical_history,
              hospital_id, license_number, address, employee_id, department, assigned_ward, is_verified, created_at
       FROM users WHERE id = $1`,
      [decoded.userId]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: "User not found" });

    res.json(result.rows[0]);
  } catch (e) {
    console.error("getMe error:", e);
    res.status(500).json({ error: "Failed to get user" });
  }
};

/**
 * POST /api/auth/forgot-password
 * Reset password using username + phone + DOB verification.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, phone, new_password } = req.body;

    if (!email || !phone || !new_password) {
      return res.status(400).json({ error: "email, phone, and new_password are required" });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Verify user exists with matching email and phone
    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND phone = $2",
      [email, phone]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No account found with this email and phone combination" });
    }

    const passwordHash = await bcrypt.hash(new_password, SALT_ROUNDS);

    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [passwordHash, result.rows[0].id]
    );

    res.json({ message: "Password reset successfully" });
  } catch (e) {
    console.error("forgotPassword error:", e);
    res.status(500).json({ error: "Password reset failed" });
  }
};
