CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text,
  country_code text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS places_public_idx ON places (is_public);
CREATE INDEX IF NOT EXISTS places_country_time_idx ON places (country_code, created_at DESC);
CREATE INDEX IF NOT EXISTS places_lat_idx ON places (lat);
CREATE INDEX IF NOT EXISTS places_lng_idx ON places (lng);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'unlock_state') THEN
    CREATE TYPE unlock_state AS ENUM ('locked','unlocked');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS interest_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id text,
  country_code text NOT NULL,
  voted_on timestamptz NOT NULL DEFAULT now(),
  ip_hash text,
  user_agent text,
  note text,
  CONSTRAINT interest_votes_country_chk CHECK (char_length(country_code) = 2)
);
CREATE INDEX IF NOT EXISTS interest_votes_country_time_idx ON interest_votes (country_code, voted_on DESC);

CREATE TABLE IF NOT EXISTS country_unlocks (
  country_code text PRIMARY KEY,
  unlocked_at timestamptz NOT NULL,
  score int NOT NULL DEFAULT 0,
  state unlock_state NOT NULL DEFAULT 'locked',
  CONSTRAINT country_unlocks_country_chk CHECK (char_length(country_code) = 2),
  CONSTRAINT country_unlocks_score_chk CHECK (score >= 0)
);
CREATE INDEX IF NOT EXISTS country_unlocks_state_idx ON country_unlocks (state);
CREATE INDEX IF NOT EXISTS country_unlocks_unlocked_at_desc_idx ON country_unlocks (unlocked_at DESC);
