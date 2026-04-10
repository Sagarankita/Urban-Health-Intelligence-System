-- Seed doctors across all hospitals
INSERT INTO doctors (name, department, specialization, hospital_id) VALUES
  ('Dr. Rajesh Kumar',     'Respiratory Medicine', 'Sr. Consultant',            1),
  ('Dr. Sneha Iyer',       'General Medicine',     'Physician',                 1),
  ('Dr. Amit Verma',       'Cardiology',           'Interventional Cardiologist',1),
  ('Dr. Priya Nair',       'Pediatrics',           'Child Specialist',          1),
  ('Dr. Suresh Patil',     'Orthopedics',          'Joint Replacement',         2),
  ('Dr. Kavita Shah',      'General Medicine',     'Physician',                 2),
  ('Dr. Ramesh Joshi',     'Emergency',            'Emergency Medicine',        2),
  ('Dr. Meena Deshmukh',   'Dermatology',          'Skin Specialist',           3),
  ('Dr. Anand Kulkarni',   'ENT',                  'Sr. ENT Surgeon',           3),
  ('Dr. Pooja Sharma',     'Gynecology',           'Obstetrician',              4),
  ('Dr. Vikram Rao',       'Neurology',            'Neurologist',               4),
  ('Dr. Sunita Gaikwad',   'Pulmonology',          'Chest Physician',           5)
ON CONFLICT DO NOTHING;
