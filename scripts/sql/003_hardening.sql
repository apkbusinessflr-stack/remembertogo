ALTER TABLE IF EXISTS cities
  ADD CONSTRAINT cities_slug_country_uniq UNIQUE (country_code, slug);

CREATE INDEX IF NOT EXISTS cities_approved_idx
  ON cities(country_code, approved) WHERE approved = true;

CREATE INDEX IF NOT EXISTS countries_approved_idx
  ON countries(approved) WHERE approved = true;

CREATE INDEX IF NOT EXISTS cities_created_cover
  ON cities(country_code, approved, created_at DESC);
