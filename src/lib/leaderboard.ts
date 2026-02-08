import type { PredictionRow } from "@/types/database";
import type { ResultsRow } from "@/types/database";
import { GUEST_LIST, POINTS } from "./constants";

export interface LeaderboardEntry {
  guest_name: string;
  total_points: number;
  questions_correct: number;
}

function scorePrediction(
  p: PredictionRow,
  resultsByQ: Record<number, string>
): { total: number; correct: number } {
  let total = 0;
  let correct = 0;
  for (let q = 1; q <= 10; q++) {
    const key = `q${q}` as keyof PredictionRow;
    const userAnswer = p[key];
    const correctAnswer = resultsByQ[q];
    if (typeof userAnswer !== "string" || !correctAnswer) continue;
    const normalizedUser = userAnswer.trim();
    const normalizedCorrect = correctAnswer.trim();
    if (normalizedUser === normalizedCorrect) {
      total += POINTS[q - 1];
      correct += 1;
    }
  }
  return { total, correct };
}

export function computeLeaderboard(
  predictions: PredictionRow[],
  results: ResultsRow[]
): LeaderboardEntry[] {
  const resultsByQ = Object.fromEntries(results.map((r) => [r.question_number, r.correct_answer]));
  const byName = new Map(predictions.map((p) => [p.guest_name, p]));

  const entries: LeaderboardEntry[] = GUEST_LIST.map((guest_name) => {
    const p = byName.get(guest_name);
    if (!p) {
      return { guest_name, total_points: 0, questions_correct: 0 };
    }
    const { total, correct } = scorePrediction(p, resultsByQ);
    return { guest_name, total_points: total, questions_correct: correct };
  });

  entries.sort(
    (a, b) => b.total_points - a.total_points || a.guest_name.localeCompare(b.guest_name)
  );
  return entries;
}

/** Points earned per question (1–10); 0 if wrong or unanswered. */
export function getPointsPerQuestion(
  prediction: PredictionRow | null,
  resultsByQ: Record<number, string>
): number[] {
  const out: number[] = [];
  for (let q = 1; q <= 10; q++) {
    const key = `q${q}` as keyof PredictionRow;
    const userAnswer = prediction?.[key];
    const correctAnswer = resultsByQ[q];
    if (typeof userAnswer !== "string" || !correctAnswer) {
      out.push(0);
      continue;
    }
    const match =
      (userAnswer as string).trim() === (correctAnswer as string).trim();
    out.push(match ? POINTS[q - 1] : 0);
  }
  return out;
}
