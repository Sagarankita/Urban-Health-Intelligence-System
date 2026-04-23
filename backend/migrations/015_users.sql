CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PATIENT',
  phone TEXT,
  ward TEXT,
  insurance TEXT,
  abha TEXT,
  insurance_id TEXT,
  allergies TEXT,
  medical_history TEXT,
  age TEXT,
  gender TEXT,
  hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
