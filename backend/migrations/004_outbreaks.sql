CREATE TABLE outbreaks (
  id SERIAL PRIMARY KEY,
  ward TEXT,
  zone TEXT,                -- RED / YELLOW / GREEN
  outbreak_prob FLOAT,
  z_score FLOAT,
  growth_48h FLOAT,
  cases INTEGER,
  syndrome TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);