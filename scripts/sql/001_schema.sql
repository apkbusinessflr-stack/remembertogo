CREATE TABLE IF NOT EXISTS countries (
  code text PRIMARY KEY,
  name text NOT NULL,
  approved boolean DEFAULT false,
  approved_at timestamptz
);

CREATE TABLE IF NOT EXISTS cities (
  id bigserial PRIMARY KEY,
  country_code text NOT NULL,
  slug text NOT NULL,
  name text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT NOW(),
  CONSTRAINT fk_cities_country FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS interest_counters (
  id bigserial PRIMARY KEY,
  country_code text NOT NULL,
  day date NOT NULL,
  count int NOT NULL DEFAULT 0,
  CONSTRAINT fk_interest_country FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
  id bigserial PRIMARY KEY,
  created_at timestamptz DEFAULT NOW(),
  kind text NOT NULL,
  payload jsonb
);
