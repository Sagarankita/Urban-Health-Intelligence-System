-- Wards for Maharashtra cities (seed)
-- Pune
INSERT INTO wards (city_id, name)
SELECT c.id, w.name
FROM cities c
JOIN (VALUES
  ('Ward 1 - Shivajinagar'),
  ('Ward 2 - Kothrud'),
  ('Ward 3 - Aundh'),
  ('Ward 4 - Baner'),
  ('Ward 5 - Pimpri'),
  ('Ward 6 - Chinchwad'),
  ('Ward 7 - Hadapsar'),
  ('Ward 8 - Yerwada'),
  ('Ward 9 - Viman Nagar'),
  ('Ward 10 - Wakad'),
  ('Ward 23')
) AS w(name) ON TRUE
WHERE c.state='Maharashtra' AND c.name='Pune'
ON CONFLICT (city_id, name) DO NOTHING;

-- Mumbai
INSERT INTO wards (city_id, name)
SELECT c.id, w.name
FROM cities c
JOIN (VALUES
  ('Ward A - Colaba'),
  ('Ward B - Fort'),
  ('Ward C - Dadar'),
  ('Ward D - Andheri'),
  ('Ward E - Borivali')
) AS w(name) ON TRUE
WHERE c.state='Maharashtra' AND c.name='Mumbai'
ON CONFLICT (city_id, name) DO NOTHING;

