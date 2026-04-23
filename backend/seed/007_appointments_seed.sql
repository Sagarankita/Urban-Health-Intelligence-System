-- Seed appointments (uses doctor ids from 006 seed)
INSERT INTO appointments (patient_name, department, doctor_id, hospital_id, appointment_date, appointment_time, insurance, status, priority) VALUES
  -- Priya Sharma (patient@example.com) – Hospital 1
  ('Priya Sharma',      'General Medicine',      2, 1, CURRENT_DATE,       '10:00 AM', 'PM-JAY', 'PENDING',   'NORMAL'),
  ('Priya Sharma',      'Cardiology',            3, 1, CURRENT_DATE - 7,   '11:30 AM', 'PM-JAY', 'APPROVED',  'HIGH'),
  ('Priya Sharma',      'Respiratory Medicine',  1, 1, CURRENT_DATE + 3,   '09:00 AM', 'PM-JAY', 'PENDING',   'NORMAL'),

  -- Rahul Mehta (patient2@example.com) – Hospital 2
  ('Rahul Mehta',       'Orthopedics',           5, 2, CURRENT_DATE,       '02:00 PM', 'ABHA',   'APPROVED',  'NORMAL'),
  ('Rahul Mehta',       'Emergency',             7, 2, CURRENT_DATE - 3,   '03:30 PM', 'ABHA',   'APPROVED',  'URGENT'),
  ('Rahul Mehta',       'General Medicine',      6, 2, CURRENT_DATE + 5,   '01:00 PM', 'ABHA',   'PENDING',   'NORMAL'),

  -- Sunita Desai (patient3@example.com) – Hospital 3
  ('Sunita Desai',      'ENT',                   9, 3, CURRENT_DATE,       '11:00 AM', 'CGHS',   'APPROVED',  'NORMAL'),
  ('Sunita Desai',      'Dermatology',           8, 3, CURRENT_DATE + 2,   '12:30 PM', 'CGHS',   'PENDING',   'LOW'),

  -- Other patients
  ('Rajesh Kumar',      'Cardiology',            3, 1, CURRENT_DATE,       '11:30 AM', 'CGHS',   'PENDING',   'HIGH'),
  ('Anita Desai',       'Orthopedics',           5, 2, CURRENT_DATE,       '02:30 PM', 'PM-JAY', 'APPROVED',  'NORMAL'),
  ('Vikram Singh',      'Emergency',             7, 2, CURRENT_DATE,       '04:00 PM', 'ABHA',   'PENDING',   'URGENT'),
  ('Meera Patel',       'Pediatrics',            4, 1, CURRENT_DATE + 1,   '09:00 AM', 'PM-JAY', 'APPROVED',  'LOW'),
  ('Rohit Nair',        'Respiratory Medicine',  1, 1, CURRENT_DATE + 1,   '10:30 AM', 'ABHA',   'PENDING',   'NORMAL'),
  ('Sneha Kulkarni',    'ENT',                   9, 3, CURRENT_DATE,       '11:30 AM', 'PM-JAY', 'APPROVED',  'NORMAL'),
  ('Amit Joshi',        'General Medicine',      6, 2, CURRENT_DATE + 2,   '01:30 PM', 'CGHS',   'PENDING',   'NORMAL'),
  ('Pooja Nair',        'Gynecology',            10, 4, CURRENT_DATE,      '10:00 AM', 'PM-JAY', 'APPROVED',  'NORMAL'),
  ('Anil Desai',        'Neurology',             11, 4, CURRENT_DATE + 1,  '02:00 PM', 'CGHS',   'PENDING',   'NORMAL'),
  ('Kavita Jain',       'Pulmonology',           12, 5, CURRENT_DATE,      '03:00 PM', 'ABHA',   'PENDING',   'HIGH')
ON CONFLICT DO NOTHING;
