INSERT INTO advisories (message, target_area) VALUES
  ('Respiratory illness surge detected. Wear masks in crowded areas.',                       'Ward 1 - Shivajinagar'),
  ('High dengue risk. Eliminate stagnant water near your home.',                             'Ward 5 - Pimpri'),
  ('Gastroenteritis cluster reported. Avoid eating outside. Boil drinking water.',           'Ward 3 - Aundh'),
  ('Air quality index is poor today. Avoid outdoor exercise between 7–10 AM.',              'Pune'),
  ('Influenza vaccination camp at City General Hospital. Free for all residents.',           'Pune'),
  ('COVID-like symptoms reported in Viman Nagar. Please self-isolate if symptomatic.',       'Ward 9 - Viman Nagar'),
  ('Vector-borne disease alert. Use mosquito repellents and sleep under nets.',              'Ward 8 - Yerwada'),
  ('Water-borne disease advisory: Municipal water supply may be contaminated in your ward.', 'Ward 7 - Hadapsar'),
  ('Heat wave alert. Stay hydrated and avoid direct sun exposure between 11 AM–4 PM.',       'Mumbai'),
  ('Free health checkup camp at KEM Hospital on Friday 9 AM–1 PM. All welcome.',            'Ward A - Colaba')
ON CONFLICT DO NOTHING;
