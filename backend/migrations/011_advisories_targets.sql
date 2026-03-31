ALTER TABLE advisories
ADD COLUMN IF NOT EXISTS city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL;

ALTER TABLE advisories
ADD COLUMN IF NOT EXISTS ward_id INTEGER REFERENCES wards(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_advisories_city_id ON advisories(city_id);
CREATE INDEX IF NOT EXISTS idx_advisories_ward_id ON advisories(ward_id);

