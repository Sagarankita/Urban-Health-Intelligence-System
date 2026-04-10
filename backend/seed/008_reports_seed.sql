-- Seed patient reports (extends existing reports with new columns from migration 014)
INSERT INTO reports (symptoms, severity, risk, ward, patient_name, hospital_id, is_critical, status, recommendation, created_at) VALUES
  ('["Fever","Cough","Fatigue"]',         72, 'High',     'Ward 23, Pune', 'Vikram Singh',  1, false, 'NEW',      'Visit hospital immediately',   NOW() - INTERVAL '2 hours'),
  ('["Headache","Body Ache"]',            45, 'Moderate', 'Ward 15, Pune', 'Meera Patel',   1, false, 'NEW',      'Monitor symptoms and rest',    NOW() - INTERVAL '3 hours'),
  ('["Nausea","Dizziness"]',              28, 'Low',      'Ward 8, Pune',  'Arjun Reddy',   1, false, 'REVIEWED', 'Monitor symptoms and rest',    NOW() - INTERVAL '5 hours'),
  ('["Chest Pain","Shortness of Breath"]',85, 'Severe',   'Ward 10, Pune', 'Priya Sharma',  1, true,  'NEW',      'Visit hospital immediately',   NOW() - INTERVAL '30 minutes'),
  ('["Sore Throat","Runny Nose"]',        22, 'Low',      'Ward 5, Pune',  'Rohit Kumar',   1, false, 'REVIEWED', 'Monitor symptoms and rest',    NOW() - INTERVAL '6 hours'),
  ('["Fever","Headache","Body Ache"]',    60, 'Moderate', 'Ward 3, Pune',  'Anil Desai',    2, false, 'NEW',      'Monitor symptoms and rest',    NOW() - INTERVAL '1 hour'),
  ('["Cough","Fatigue"]',                 35, 'Mild',     'Ward 12, Pune', 'Sunita Patil',  3, false, 'REVIEWED', 'Monitor symptoms and rest',    NOW() - INTERVAL '4 hours'),
  ('["Fever","Cough","Chest Pain"]',      78, 'High',     'Ward 1, Pune',  'Ramesh Shah',   2, true,  'NEW',      'Visit hospital immediately',   NOW() - INTERVAL '45 minutes')
ON CONFLICT DO NOTHING;
