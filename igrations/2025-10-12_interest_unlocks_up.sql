-- === countries: ISO 3166-1 alpha-2 (π.χ. 'GR') ===
-- Αν δεν έχεις πίνακα χωρών, δουλεύουμε με text CHECK.

-- 1) Βοηθητικός τύπος για state (optional, ή βάλε TEXT + CHECK)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'unlock_state') THEN
    CREATE TYPE unlock_state AS ENUM ('locked', 'unlocked');
  END IF;
END$$;

-- 2) interest_votes : μία γραμμή = μία ψήφος ενδιαφέροντος
CREATE TABLE IF NOT EXISTS interest_votes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id      text,                         -- optional, π.χ. user id ή email hash
  country_code  text NOT NULL,                -- 'GR', 'US', ...
  voted_on      timestamptz NOT NULL DEFAULT now(),
  ip_hash       text,                         -- (προαιρετικό) hashed IP για anti-abuse/analytics
  user_agent    text,                         -- (προαιρετικό) UA snapshot
  note          text,

  -- Γρήγορος έλεγχος 2 γραμμάτων (μη αυστηρό ISO validation)
  CONSTRAINT interest_votes_country_chk CHECK (char_length(country_code) = 2)
);

-- Μοναδικότητα (προαιρετικό): 1 ψήφος/χρήστη/χώρα. Αν δεν έχεις voter_id, μπορείς να το αφαιρέσεις.
-- CREATE UNIQUE INDEX IF NOT EXISTS interest_votes_voter_country_uidx
--   ON interest_votes (voter_id, country_code);

-- Index για time-window συγκεντρώσεις (χρησιμοποιείται από το cron)
CREATE INDEX IF NOT EXISTS interest_votes_country_time_idx
  ON interest_votes (country_code, voted_on DESC);

-- 3) country_unlocks : η τρέχουσα κατάσταση ανά χώρα
CREATE TABLE IF NOT EXISTS country_unlocks (
  country_code  text PRIMARY KEY,
  unlocked_at   timestamptz NOT NULL,   -- πότε “έπιασε” το threshold
  score         int NOT NULL DEFAULT 0, -- πόσες ψήφοι στο παράθυρο
  state         unlock_state NOT NULL DEFAULT 'locked',

  CONSTRAINT country_unlocks_country_chk CHECK (char_length(country_code) = 2),
  CONSTRAINT country_unlocks_score_chk CHECK (score >= 0)
);

-- Βοηθητικοί δείκτες (για admin/queries)
CREATE INDEX IF NOT EXISTS country_unlocks_state_idx
  ON country_unlocks (state);

CREATE INDEX IF NOT EXISTS country_unlocks_unlocked_at_desc_idx
  ON country_unlocks (unlocked_at DESC);
