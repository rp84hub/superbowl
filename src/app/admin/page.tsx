"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamLogo } from "@/components/TeamLogo";
import { QUESTIONS, TEAM_OPTIONS, OT_OPTIONS } from "@/lib/constants";
import { supabase } from "@/lib/supabase/client";
import type { ResultsRow } from "@/types/database";


export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<Record<number, string>>({});
  const [lockSubmissions, setLockSubmissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | "lock" | null>(null);

  const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;

  useEffect(() => {
    if (token) {
      setAuthed(true);
      fetchResults(token);
      fetchLock(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  function fetchResults(t: string) {
    supabase
      .from("results")
      .select("*")
      .then(({ data }) => {
        const map: Record<number, string> = {};
        (data as ResultsRow[] ?? []).forEach((r) => {
          map[r.question_number] = r.correct_answer;
        });
        setResults(map);
        setLoading(false);
      });
  }

  function fetchLock(t: string) {
    fetch("/api/admin/lock", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.lock_submissions !== undefined) setLockSubmissions(data.lock_submissions);
      });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Enter the admin password.");
      return;
    }
    fetch("/api/admin/lock", { headers: { Authorization: `Bearer ${password}` } })
      .then((r) => {
        if (r.ok) {
          sessionStorage.setItem("admin_token", password);
          setAuthed(true);
          setPassword("");
          fetchResults(password);
          fetchLock(password);
        } else {
          setError("Wrong password.");
        }
      })
      .catch(() => setError("Something went wrong."));
  }

  function updateResult(questionNumber: number, correctAnswer: string) {
    if (!token) return;
    setSaving(questionNumber);
    fetch("/api/admin/results", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question_number: questionNumber, correct_answer: correctAnswer }),
    })
      .then((r) => {
        if (r.ok) {
          setResults((prev) => ({ ...prev, [questionNumber]: correctAnswer }));
        }
      })
      .finally(() => setSaving(null));
  }

  function toggleLock() {
    if (!token) return;
    setSaving("lock");
    const next = !lockSubmissions;
    fetch("/api/admin/lock", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ lock_submissions: next }),
    })
      .then((r) => {
        if (r.ok) setLockSubmissions(next);
      })
      .finally(() => setSaving(null));
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-12">
        <h1 className="text-xl font-bold mb-4">Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-white focus:border-patriots-red focus:outline-none"
              placeholder="Admin password"
              autoFocus
            />
          </div>
          {error && <p className="text-patriots-red text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-patriots-red text-white font-bold py-2 hover:bg-patriots-red/90"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-white/60">Loading admin…</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Admin — Set results</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back to app
          </button>
          <button
            onClick={toggleLock}
            disabled={saving === "lock"}
            className={`rounded-lg px-4 py-2 font-medium text-sm ${
              lockSubmissions
                ? "bg-seahawks-green text-seahawks-navy"
                : "bg-patriots-red text-white"
            }`}
          >
            {saving === "lock" ? "…" : lockSubmissions ? "Unlock submissions" : "Lock submissions"}
          </button>
        </div>
      </div>

      <p className="text-white/70 text-sm">
        Select the correct answer for each question. The leaderboard updates in real time.
      </p>

      <div className="space-y-4">
        {QUESTIONS.map((q) => (
          <div
            key={q.id}
            className="rounded-xl border border-white/10 bg-black/30 p-4"
          >
            <p className="font-medium text-white/90 mb-3">
              {q.id}. {q.text} <span className="text-superbowl-gold">({q.pts} pts)</span>
            </p>
            {q.type === "overtime" ? (
              <div className="flex flex-wrap gap-2">
                {OT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateResult(q.id, opt)}
                    disabled={saving === q.id}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                      results[q.id] === opt
                        ? "border-superbowl-gold bg-superbowl-gold/20 text-superbowl-gold"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {TEAM_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateResult(q.id, opt)}
                    disabled={saving === q.id}
                    className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                      results[q.id] === opt
                        ? opt === "Seahawks"
                          ? "border-seahawks-green bg-seahawks-green/20 text-seahawks-green"
                          : opt === "Patriots"
                            ? "border-patriots-red bg-patriots-red/20 text-patriots-red"
                            : "border-superbowl-gold bg-superbowl-gold/20 text-superbowl-gold"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    {(opt === "Seahawks" || opt === "Patriots") && <TeamLogo team={opt} size="sm" />}
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {results[q.id] && (
              <p className="mt-2 text-white/50 text-xs">Current: {results[q.id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
