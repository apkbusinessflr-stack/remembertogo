-- scripts/sql/004_app_entities.sql

-- Πίνακας δημόσιων/ιδιωτικών σημείων (όπως τα χρησιμοποιεί /api/places)
CREATE TABLE IF NOT EXISTS places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner uuid NOT NULL,
  kind text NOT NULL DEFAULT 'poi', -- τυποποίηση: poi/photo/etc
  title text NOT NULL,
  description text,
  country_code text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Δείκτες για γεωγραφικό φιλτράρισμα & λίστες
CREATE INDEX IF NOT EXISTS places_bbox_idx ON places (lng, lat);
CREATE INDEX IF NOT EXISTS places_public_created_idx ON places (is_public, created_at DESC);
CREATE INDEX IF NOT EXISTS places_owner_idx ON places (owner);

-- Ψήφοι ενδιαφέροντος (όπως τους γράφει /api/interest)
CREATE TABLE IF NOT EXISTS interest_votes (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  country_code text NOT NULL,
  kind text,
  voted_on date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS interest_votes_uniq
  ON interest_votes(user_id, voted_on, country_code);

-- Αποτελέσματα unlock ανά χώρα (όπως τα ενημερώνει το cron)
CREATE TABLE IF NOT EXISTS country_unlocks (
  country_code text PRIMARY KEY,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  score int NOT NULL DEFAULT 0,
  state text NOT NULL DEFAULT 'unlocked'
);
