-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'hospital', 'municipal')),
  -- Patient fields
  age TEXT,
  gender TEXT,
  ward TEXT,
  insurance TEXT,
  abha TEXT,
  insurance_id TEXT,
  allergies TEXT,
  medical_history TEXT,
  -- Hospital fields
  hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
  license_number TEXT,
  address TEXT,
  -- Municipal fields
  employee_id TEXT,
  department TEXT,
  assigned_ward TEXT,
  -- Metadata
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
