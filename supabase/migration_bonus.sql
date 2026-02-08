-- Run this in Supabase SQL Editor if you already have the app deployed (adds bonus question support)

-- Allow results for question 11 (bonus)
ALTER TABLE results DROP CONSTRAINT IF EXISTS results_question_number_check;
ALTER TABLE results ADD CONSTRAINT results_question_number_check CHECK (question_number >= 1 AND question_number <= 11);

-- Insert bonus result row
INSERT INTO results (question_number, correct_answer, updated_at)
VALUES (11, '', now())
ON CONFLICT (question_number) DO NOTHING;

-- Add bonus answer column to predictions
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS bonus_answer TEXT;
