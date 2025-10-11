INSERT INTO countries(code, name, approved) VALUES
  ('PT','Portugal', true),
  ('ES','Spain', true),
  ('FR','France', false),
  ('IT','Italy', false)
ON CONFLICT (code) DO NOTHING;

INSERT INTO cities(country_code, slug, name, approved) VALUES
  ('PT','lisboa','Lisboa', true),
  ('PT','porto','Porto', true),
  ('ES','barcelona','Barcelona', true),
  ('FR','paris','Paris', false)
ON CONFLICT DO NOTHING;

-- Seed some interest counts (yesterday and today)
INSERT INTO interest_counters(country_code, day, count) VALUES
  ('FR', CURRENT_DATE - 1, 3),
  ('FR', CURRENT_DATE, 4),
  ('IT', CURRENT_DATE - 1, 2),
  ('IT', CURRENT_DATE, 5);
