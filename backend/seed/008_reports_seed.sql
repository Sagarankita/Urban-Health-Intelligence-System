-- Seed patient reports (extends existing reports with new columns from migration 014)
INSERT INTO reports (symptoms, severity, risk, ward, patient_name, hospital_id, is_critical, status, recommendation, created_at) VALUES
  -- Priya Sharma (patient@example.com)
  ('["Chest Pain","Shortness of Breath"]', 85, 'Severe',   'Ward 23, Pune',          'Priya Sharma',  1, true,  'NEW',      'Visit hospital immediately',          NOW() - INTERVAL '30 minutes'),
  ('["Fever","Cough","Fatigue"]',           72, 'High',     'Ward 23, Pune',          'Priya Sharma',  1, false, 'REVIEWED', 'Take prescribed medication and rest', NOW() - INTERVAL '5 days'),
  ('["Headache","Body Ache"]',              45, 'Moderate', 'Ward 23, Pune',          'Priya Sharma',  1, false, 'REVIEWED', 'Monitor symptoms and rest',           NOW() - INTERVAL '12 days'),

  -- Rahul Mehta (patient2@example.com)
  ('["Fever","Joint Pain","Fatigue"]',      65, 'Moderate', 'Ward 5 - Pimpri',        'Rahul Mehta',   2, false, 'NEW',      'Monitor symptoms and rest',           NOW() - INTERVAL '1 hour'),
  ('["High BP","Dizziness"]',               70, 'High',     'Ward 5 - Pimpri',        'Rahul Mehta',   2, false, 'REVIEWED', 'Continue BP medication, follow-up',   NOW() - INTERVAL '8 days'),

  -- Sunita Desai (patient3@example.com)
  ('["Cough","Wheezing","Shortness of Breath"]', 60, 'Moderate', 'Ward 3 - Aundh',   'Sunita Desai',  3, false, 'NEW',      'Use inhaler as prescribed',           NOW() - INTERVAL '2 hours'),
  ('["Sore Throat","Runny Nose","Fever"]',  40, 'Mild',     'Ward 3 - Aundh',         'Sunita Desai',  3, false, 'REVIEWED', 'Rest and stay hydrated',              NOW() - INTERVAL '6 days'),

  -- Other patients
  ('["Fever","Cough","Fatigue"]',           72, 'High',     'Ward 1, Pune',           'Vikram Singh',  1, false, 'NEW',      'Visit hospital immediately',          NOW() - INTERVAL '2 hours'),
  ('["Headache","Body Ache"]',              45, 'Moderate', 'Ward 15, Pune',          'Meera Patel',   1, false, 'NEW',      'Monitor symptoms and rest',           NOW() - INTERVAL '3 hours'),
  ('["Nausea","Dizziness"]',                28, 'Low',      'Ward 8, Pune',           'Arjun Reddy',   1, false, 'REVIEWED', 'Monitor symptoms and rest',           NOW() - INTERVAL '5 hours'),
  ('["Sore Throat","Runny Nose"]',          22, 'Low',      'Ward 5, Pune',           'Rohit Kumar',   1, false, 'REVIEWED', 'Monitor symptoms and rest',           NOW() - INTERVAL '6 hours'),
  ('["Fever","Headache","Body Ache"]',      60, 'Moderate', 'Ward 3, Pune',           'Anil Desai',    2, false, 'NEW',      'Monitor symptoms and rest',           NOW() - INTERVAL '1 hour'),
  ('["Cough","Fatigue"]',                   35, 'Mild',     'Ward 12, Pune',          'Sunita Patil',  3, false, 'REVIEWED', 'Monitor symptoms and rest',           NOW() - INTERVAL '4 hours'),
  ('["Fever","Cough","Chest Pain"]',        78, 'High',     'Ward 1, Pune',           'Ramesh Shah',   2, true,  'NEW',      'Visit hospital immediately',          NOW() - INTERVAL '45 minutes'),
  ('["Rash","Itching","Fever"]',            50, 'Moderate', 'Ward 7 - Hadapsar',      'Pooja Nair',    4, false, 'NEW',      'Consult dermatologist',               NOW() - INTERVAL '3 hours'),
  ('["Severe Headache","Blurred Vision"]',  80, 'High',     'Ward 9 - Viman Nagar',   'Kavita Jain',   5, true,  'NEW',      'Visit hospital immediately',          NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;
