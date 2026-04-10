-- Extend the existing reports table with additional columns for hospital module
ALTER TABLE reports ADD COLUMN IF NOT EXISTS patient_name TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS hospital_id INTEGER REFERENCES hospitals(id) ON DELETE SET NULL;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_critical BOOLEAN DEFAULT FALSE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'NEW';
ALTER TABLE reports ADD COLUMN IF NOT EXISTS recommendation TEXT;

CREATE INDEX IF NOT EXISTS idx_reports_hospital ON reports(hospital_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC);
