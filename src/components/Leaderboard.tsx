"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { computeLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";
import type { PredictionRow } from "@/types/database";
import type { ResultsRow } from "@/types/database";

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchAndCompute() {
    setLoading(true);
    Promise.all([
      supabase.from("predictions").select("*").order("guest_name"),
      supabase.from("results").select("*"),
    ]).then(([predRes, resRes]) => {
      const predictions = (predRes.data ?? []) as PredictionRow[];
      const results = (resRes.data ?? []) as ResultsRow[];
      setEntries(computeLeaderboard(predictions, results));
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchAndCompute();

    const subPred = supabase
      .channel("predictions-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "predictions" }, () => {
        fetchAndCompute();
      })
      .subscribe();

    const subRes = supabase
      .channel("results-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "results" }, () => {
        fetchAndCompute();
      })
      .subscribe();

    return () => {
      subPred.unsubscribe();
      subRes.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-center text-white/60">
        Loading leaderboard…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
      <div className="bg-superbowl-gold/20 px-4 py-3 border-b border-white/10">
        <h2 className="font-bold text-lg text-superbowl-gold">Leaderboard</h2>
        <p className="text-sm text-white/70">Updates in real time</p>
      </div>
      <ul className="divide-y divide-white/10">
        {entries.map((entry, index) => (
          <li
            key={entry.guest_name}
            className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0
                    ? "bg-superbowl-gold text-black"
                    : index === 1
                      ? "bg-patriots-silver text-patriots-navy"
                      : index === 2
                        ? "bg-amber-700 text-amber-100"
                        : "bg-white/10 text-white/80"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-medium">{entry.guest_name}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-white/70">{entry.questions_correct} correct</span>
              <span className="font-bold text-seahawks-green">{entry.total_points} pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
