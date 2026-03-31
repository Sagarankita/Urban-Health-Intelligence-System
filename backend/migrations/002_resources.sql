-- Postgres requires an enum TYPE before using it in a table.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_status') THEN
    CREATE TYPE resource_status AS ENUM ('ACTIVE', 'LIMITED', 'CLOSED');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS resources (
  hospital_id INTEGER PRIMARY KEY,
  gen_beds INTEGER,
  icu_beds INTEGER,
  ventilators INTEGER,
  status resource_status NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hospital
    FOREIGN KEY (hospital_id)
    REFERENCES hospitals(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);