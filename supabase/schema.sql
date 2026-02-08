-- ============================================
-- Super Bowl LX (2026) Prediction App - Schema
-- Run this in Supabase SQL Editor
--
-- After creating tables: enable Realtime in Supabase Dashboard
-- (Database → Replication) for tables: predictions, results
-- ============================================

-- 1. App settings (single row: lock submissions)
CREATE TABLE IF NOT EXISTS app_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  lock_submissions BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings row (run once; ignore if already exists)
INSERT INTO app_settings (id, lock_submissions, updated_at)
VALUES ('default', false, now())
ON CONFLICT (id) DO NOTHING;

-- 2. Results (one row per question; admin updates these)
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number INT NOT NULL UNIQUE CHECK (question_number >= 1 AND question_number <= 10),
  correct_answer TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert 10 placeholder rows for questions 1-10
INSERT INTO results (question_number, correct_answer, updated_at)
VALUES
  (1, '', now()),
  (2, '', now()),
  (3, '', now()),
  (4, '', now()),
  (5, '', now()),
  (6, '', now()),
  (7, '', now()),
  (8, '', now()),
  (9, '', now()),
  (10, '', now())
ON CONFLICT (question_number) DO NOTHING;

-- 3. Predictions (one row per guest)
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL UNIQUE,
  q1 TEXT,
  q2 TEXT,
  q3 TEXT,
  q4 TEXT,
  q5 TEXT,
  q6 TEXT,
  q7 TEXT,
  q8 TEXT,
  q9 TEXT,
  q10 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional: index for leaderboard ordering
CREATE INDEX IF NOT EXISTS idx_predictions_guest_name ON predictions(guest_name);

-- 4. Row Level Security (RLS) - allow public read only; writes via API with service role
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Policies: anon can only SELECT (reads for leaderboard and form state)
DROP POLICY IF EXISTS "Allow public read app_settings" ON app_settings;
CREATE POLICY "Allow public read app_settings" ON app_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read results" ON results;
CREATE POLICY "Allow public read results" ON results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read predictions" ON predictions;
CREATE POLICY "Allow public read predictions" ON predictions FOR SELECT USING (true);

-- No INSERT/UPDATE/DELETE for anon; your Next.js API routes will use the service role key for writes.

-- 5. Ensure single row for app_settings (optional trigger)
-- Delete duplicate rows if any, keep one
-- DELETE FROM app_settings WHERE id NOT IN (SELECT id FROM app_settings LIMIT 1);

COMMENT ON TABLE app_settings IS 'Global lock: when true, guests cannot submit or edit predictions.';
COMMENT ON TABLE results IS 'Correct answers for each of the 10 questions; updated by admin.';
COMMENT ON TABLE predictions IS 'One prediction row per guest; guest_name must be from the allowed list.';
