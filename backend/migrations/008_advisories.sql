CREATE TABLE IF NOT EXISTS advisories (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  target_area VARCHAR(100), -- e.g. "Ward 23", "Pune"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);