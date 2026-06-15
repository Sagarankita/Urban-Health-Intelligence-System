CREATE TABLE ward_data (
  id SERIAL PRIMARY KEY,
  ward TEXT UNIQUE,
  syndrome TEXT,
  hospital_load_pct FLOAT,
  pmjay_coverage_pct FLOAT,
  population_density TEXT,
  water_quality_issue INTEGER,
  sanitation_score INTEGER,
  nearest_hospital_km FLOAT,
  day1 INTEGER, day2 INTEGER, day3 INTEGER, day4 INTEGER, day5 INTEGER,
  day6 INTEGER, day7 INTEGER, day8 INTEGER, day9 INTEGER, day10 INTEGER,
  day11 INTEGER, day12 INTEGER, day13 INTEGER, day14 INTEGER, day15 INTEGER,
  day16 INTEGER, day17 INTEGER, day18 INTEGER, day19 INTEGER, day20 INTEGER,
  day21 INTEGER, day22 INTEGER, day23 INTEGER, day24 INTEGER, day25 INTEGER,
  day26 INTEGER, day27 INTEGER, day28 INTEGER, day29 INTEGER, day30 INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);