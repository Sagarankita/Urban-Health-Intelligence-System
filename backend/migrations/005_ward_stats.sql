CREATE TABLE ward_stats (
  id SERIAL PRIMARY KEY,
  ward TEXT,
  risk_level TEXT,
  score INTEGER,
  trend TEXT,
  top_symptoms JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);