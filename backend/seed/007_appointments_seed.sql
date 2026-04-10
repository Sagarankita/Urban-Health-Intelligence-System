-- Seed appointments (uses doctor ids from 006 seed)
INSERT INTO appointments (patient_name, department, doctor_id, hospital_id, appointment_date, appointment_time, insurance, status, priority) VALUES
  ('Priya Sharma',   'General Medicine',      2, 1, CURRENT_DATE,     '10:00 AM', 'PM-JAY',  'PENDING',   'NORMAL'),
  ('Rajesh Kumar',   'Cardiology',            3, 1, CURRENT_DATE,     '11:30 AM', 'CGHS',    'PENDING',   'HIGH'),
  ('Anita Desai',    'Orthopedics',           5, 2, CURRENT_DATE,     '02:00 PM', 'PM-JAY',  'APPROVED',  'NORMAL'),
  ('Vikram Singh',   'Emergency',             7, 2, CURRENT_DATE,     '03:30 PM', 'ABHA',    'PENDING',   'URGENT'),
  ('Meera Patel',    'Pediatrics',            4, 1, CURRENT_DATE + 1, '09:00 AM', 'PM-JAY',  'APPROVED',  'LOW'),
  ('Rohit Nair',     'Respiratory Medicine',  1, 1, CURRENT_DATE + 1, '10:30 AM', 'ABHA',    'PENDING',   'NORMAL'),
  ('Sneha Kulkarni', 'ENT',                   9, 3, CURRENT_DATE,     '11:00 AM', 'PM-JAY',  'APPROVED',  'NORMAL'),
  ('Amit Joshi',     'General Medicine',      6, 2, CURRENT_DATE + 2, '01:00 PM', 'CGHS',    'PENDING',   'NORMAL')
ON CONFLICT DO NOTHING;
