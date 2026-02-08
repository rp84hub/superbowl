"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { getPointsPerQuestion } from "@/lib/leaderboard";
import { QUESTIONS } from "@/lib/constants";
import type { PredictionRow } from "@/types/database";
import type { ResultsRow } from "@/types/database";

interface ScoreBreakdownProps {
  guestName: string;
}

export function ScoreBreakdown({ guestName }: ScoreBreakdownProps) {
  const [pointsPerQ, setPointsPerQ] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!guestName) {
      setPointsPerQ(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      supabase.from("predictions").select("*").eq("guest_name", guestName).maybeSingle(),
      supabase.from("results").select("*"),
    ]).then(([predRes, resRes]) => {
      const prediction = (predRes.data ?? null) as PredictionRow | null;
      const results = (resRes.data ?? []) as ResultsRow[];
      const resultsByQ = Object.fromEntries(results.map((r) => [r.question_number, r.correct_answer]));
      setPointsPerQ(getPointsPerQuestion(prediction, resultsByQ));
      setLoading(false);
    });
  }, [guestName]);

  if (!guestName || loading || pointsPerQ === null) {
    return null;
  }

  const total = pointsPerQ.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
      <div className="bg-patriots-navy/60 px-4 py-3 border-b border-patriots-red/30">
        <h2 className="font-bold text-lg text-patriots-red">Score breakdown — {guestName}</h2>
        <p className="text-sm text-white/70">
          Points per question (0 = incorrect)
        </p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
          {QUESTIONS.map((q, i) => (
            <div
              key={q.id}
              className={`rounded-lg border px-3 py-2 text-center ${
                pointsPerQ[i] > 0
                  ? "border-seahawks-green/50 bg-seahawks-green/10 text-seahawks-green"
                  : "border-white/10 bg-white/5 text-white/50"
              }`}
            >
              <div className="font-medium">Q{q.id}</div>
              <div className="font-bold">{pointsPerQ[i]} pt{pointsPerQ[i] !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-white/80 font-medium">
          Total: <span className="text-seahawks-green">{total} pts</span>
        </p>
      </div>
    </div>
  );
}
