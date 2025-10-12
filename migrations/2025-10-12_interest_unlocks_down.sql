-- Rollback: προσοχή – θα χαθούν δεδομένα
DROP INDEX IF EXISTS country_unlocks_unlocked_at_desc_idx;
DROP INDEX IF EXISTS country_unlocks_state_idx;
DROP TABLE IF EXISTS country_unlocks;

DROP INDEX IF EXISTS interest_votes_country_time_idx;
-- DROP INDEX IF EXISTS interest_votes_voter_country_uidx;
DROP TABLE IF EXISTS interest_votes;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'unlock_state') THEN
    DROP TYPE unlock_state;
  END IF;
END$$;
