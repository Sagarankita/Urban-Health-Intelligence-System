CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  symptoms JSONB,
  severity INTEGER,
  risk TEXT,
  ward TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);