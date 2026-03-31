-- Seed entrypoint. Truncate all dependent tables to keep inserts repeatable.
TRUNCATE
  wards,
  cities,
  outbreaks,
  ward_stats,
  ward_data,
  reports,
  resources,
  hospitals
RESTART IDENTITY CASCADE;

-- hospitals
INSERT INTO hospitals (id, name, location)
VALUES
  (1, 'City General Hospital', 'Shivajinagar'),
  (2, 'Pune Medical Center', 'Kothrud'),
  (3, 'Aundh District Hospital', 'Aundh'),
  (4, 'Sahyadri Hospital', 'Hadapsar'),
  (5, 'KEM Hospital', 'Pimpri');

-- resources
INSERT INTO resources (hospital_id, gen_beds, icu_beds, ventilators, status)
VALUES
  (1, 45, 8, 12, 'ACTIVE'),
  (2, 62, 15, 18, 'ACTIVE'),
  (3, 28, 5, 6, 'LIMITED'),
  (4, 38, 6, 10, 'ACTIVE'),
  (5, 15, 2, 3, 'LIMITED');

INSERT INTO outbreaks (ward, zone, outbreak_prob, z_score, growth_48h, cases, syndrome)
VALUES
('Ward 1 - Shivajinagar', 'RED', 82, 2.1, 35, 42, 'respiratory'),
('Ward 9 - Viman Nagar', 'YELLOW', 65, 1.4, 28, 38, 'respiratory'),
('Ward 3 - Aundh', 'GREEN', 40, 0.8, 18, 25, 'gastro');

INSERT INTO ward_stats (ward, risk_level, score, trend, top_symptoms)
VALUES
('Ward 1 - Shivajinagar', 'HIGH', 85, '+18%', '["Fever","Cough"]'),
('Ward 2 - Kothrud', 'MEDIUM', 58, 'Stable', '["Headache"]'),
('Ward 3 - Aundh', 'HIGH', 72, '+18%', '["Nausea"]');