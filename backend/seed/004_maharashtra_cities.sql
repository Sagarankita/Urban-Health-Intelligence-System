-- Maharashtra cities (seed)
INSERT INTO cities (state, name) VALUES
('Maharashtra','Mumbai'),
('Maharashtra','Pune'),
('Maharashtra','Nagpur'),
('Maharashtra','Nashik'),
('Maharashtra','Thane'),
('Maharashtra','Aurangabad'),
('Maharashtra','Solapur'),
('Maharashtra','Kolhapur'),
('Maharashtra','Amravati'),
('Maharashtra','Navi Mumbai')
ON CONFLICT (state, name) DO NOTHING;

