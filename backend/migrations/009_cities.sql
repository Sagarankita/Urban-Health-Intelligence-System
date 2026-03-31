CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  state TEXT NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (state, name)
);

