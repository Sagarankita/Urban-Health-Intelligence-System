-- Seed reports used by `models/untitled10.py` to compute symptom clusters.
-- `reports.symptoms` is a JSONB object: { "SymptomName": weightInteger, ... }.

INSERT INTO reports (symptoms, severity, risk, ward, created_at) VALUES
-- Ward 1 - Shivajinagar (respiratory)
(
  '{"Fever": 20, "Cough": 18, "Headache": 10, "Shortness of Breath": 8, "Fatigue": 7, "Body Ache": 6}'::jsonb,
  85,
  'High',
  'Ward 1 - Shivajinagar',
  NOW() - INTERVAL '2 days'
),
-- Ward 2 - Kothrud (respiratory)
(
  '{"Fever": 15, "Cough": 16, "Headache": 9, "Shortness of Breath": 5, "Fatigue": 6, "Body Ache": 5}'::jsonb,
  62,
  'Moderate',
  'Ward 2 - Kothrud',
  NOW() - INTERVAL '3 days'
),
-- Ward 3 - Aundh (gastrointestinal)
(
  '{"Nausea": 12, "Vomiting": 10, "Diarrhea": 13, "Fever": 5, "Fatigue": 6}'::jsonb,
  72,
  'High',
  'Ward 3 - Aundh',
  NOW() - INTERVAL '5 days'
),
-- Ward 4 - Baner (respiratory - lower)
(
  '{"Fever": 9, "Cough": 10, "Headache": 6, "Shortness of Breath": 3, "Fatigue": 4, "Body Ache": 3}'::jsonb,
  35,
  'Low',
  'Ward 4 - Baner',
  NOW() - INTERVAL '7 days'
),
-- Ward 5 - Pimpri (vector borne)
(
  '{"High Fever": 15, "Joint Pain": 10, "Rash": 9, "Fatigue": 7}'::jsonb,
  65,
  'Moderate',
  'Ward 5 - Pimpri',
  NOW() - INTERVAL '4 days'
),
-- Ward 6 - Chinchwad (respiratory)
(
  '{"Fever": 12, "Cough": 13, "Headache": 8, "Shortness of Breath": 4, "Fatigue": 5, "Body Ache": 4}'::jsonb,
  45,
  'Moderate',
  'Ward 6 - Chinchwad',
  NOW() - INTERVAL '6 days'
),
-- Ward 7 - Hadapsar (gastrointestinal)
(
  '{"Nausea": 10, "Vomiting": 9, "Diarrhea": 12, "Fever": 4, "Fatigue": 6}'::jsonb,
  55,
  'Moderate',
  'Ward 7 - Hadapsar',
  NOW() - INTERVAL '8 days'
),
-- Ward 8 - Yerwada (vector borne - lower)
(
  '{"High Fever": 10, "Joint Pain": 7, "Rash": 6, "Fatigue": 5}'::jsonb,
  40,
  'Low',
  'Ward 8 - Yerwada',
  NOW() - INTERVAL '9 days'
),
-- Ward 9 - Viman Nagar (respiratory - high)
(
  '{"Fever": 18, "Cough": 17, "Headache": 11, "Shortness of Breath": 7, "Fatigue": 6, "Body Ache": 6}'::jsonb,
  78,
  'High',
  'Ward 9 - Viman Nagar',
  NOW() - INTERVAL '1 day'
),
-- Ward 10 - Wakad (respiratory - lower)
(
  '{"Fever": 10, "Cough": 11, "Headache": 7, "Shortness of Breath": 3, "Fatigue": 4, "Body Ache": 3}'::jsonb,
  41,
  'Moderate',
  'Ward 10 - Wakad',
  NOW() - INTERVAL '10 days'
);

