INSERT INTO users (name, email, password, role, phone, ward, insurance, abha, insurance_id, allergies, medical_history, age, gender, hospital_id)
VALUES
  -- PATIENTS
  ('Priya Sharma',     'patient@example.com',    'password123', 'PATIENT',   '9876543210', 'Ward 23, Pune',          'PM-JAY', '12-3456-7890-1234', 'PMJAY-MH-2024-123456', 'Penicillin',   'Type 2 Diabetes diagnosed in 2020',        '32', 'Female', NULL),
  ('Rahul Mehta',      'patient2@example.com',   'test1234',    'PATIENT',   '9876543220', 'Ward 5 - Pimpri',        'ABHA',   '23-4567-8901-2345', 'ABHA-MH-2024-234567',  'Sulfa drugs',  'Hypertension, on medication since 2019',   '41', 'Male',   NULL),
  ('Sunita Desai',     'patient3@example.com',   'test1234',    'PATIENT',   '9876543221', 'Ward 3 - Aundh',         'CGHS',   '34-5678-9012-3456', 'CGHS-MH-2024-345678',  'None',         'Asthma since childhood',                   '27', 'Female', NULL),

  -- HOSPITAL ADMINS (one per hospital)
  ('Dr. Amit Verma',   'hospital@example.com',   'password123', 'HOSPITAL',  '9876543211', NULL, NULL, NULL, NULL, NULL, NULL, '45', 'Male',   1),
  ('Dr. Kavita Shah',  'hospital2@example.com',  'test1234',    'HOSPITAL',  '9876543222', NULL, NULL, NULL, NULL, NULL, NULL, '38', 'Female', 2),
  ('Dr. Meena Deshmukh','hospital3@example.com', 'test1234',    'HOSPITAL',  '9876543223', NULL, NULL, NULL, NULL, NULL, NULL, '42', 'Female', 3),
  ('Dr. Pooja Sharma', 'hospital4@example.com',  'test1234',    'HOSPITAL',  '9876543224', NULL, NULL, NULL, NULL, NULL, NULL, '36', 'Female', 4),
  ('Dr. Sunita Gaikwad','hospital5@example.com', 'test1234',    'HOSPITAL',  '9876543225', NULL, NULL, NULL, NULL, NULL, NULL, '50', 'Female', 5),

  -- MUNICIPAL OFFICERS
  ('Dr. Rajesh Patil', 'municipal@example.com',  'password123', 'MUNICIPAL', '9876543212', 'Pune City',  NULL, NULL, NULL, NULL, NULL, '50', 'Male',   NULL),
  ('Officer Anjali Rao','municipal2@example.com', 'test1234',   'MUNICIPAL', '9876543226', 'Mumbai City',NULL, NULL, NULL, NULL, NULL, '35', 'Female', NULL)
ON CONFLICT (email) DO NOTHING;
