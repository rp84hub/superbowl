"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { TeamLogo } from "./TeamLogo";
import { GUEST_LIST, QUESTIONS, TEAM_OPTIONS, TEAM_OPTIONS_WITH_TIE, QUESTION_IDS_WITH_TIE, OT_OPTIONS } from "@/lib/constants";
import type { PredictionRow } from "@/types/database";

type FormState = Record<string, string>;

interface PredictionFormProps {
  selectedGuest?: string;
  onGuestChange?: (name: string) => void;
}

export function PredictionForm({ selectedGuest, onGuestChange }: PredictionFormProps = {}) {
  const [internalGuest, setInternalGuest] = useState("");
  const guestName = onGuestChange && selectedGuest !== undefined ? selectedGuest : internalGuest;
  const setGuestName = onGuestChange && selectedGuest !== undefined ? onGuestChange : setInternalGuest;
  const [form, setForm] = useState<FormState>({});
  const [lockSubmissions, setLockSubmissions] = useState(false);
  const [existing, setExisting] = useState<PredictionRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    supabase
      .from("app_settings")
      .select("lock_submissions")
      .eq("id", "default")
      .single()
      .then(({ data }) => {
        const row = data as { lock_submissions?: boolean } | null;
        if (row?.lock_submissions) setLockSubmissions(true);
      });
  }, []);

  useEffect(() => {
    if (!guestName) {
      setExisting(null);
      setForm({});
      return;
    }
    supabase
      .from("predictions")
      .select("*")
      .eq("guest_name", guestName)
      .maybeSingle()
      .then(({ data }) => {
        const row = data as PredictionRow | null;
        setExisting(row ?? null);
        if (row) {
          const f: FormState = {};
          for (let q = 1; q <= 10; q++) {
            const key = `q${q}`;
            const val = (row as Record<string, unknown>)[key];
            if (typeof val === "string" && val) f[key] = val;
          }
          setForm(f);
        } else {
          setForm({});
        }
      });
  }, [guestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || lockSubmissions) return;
    setSaving(true);
    setMessage(null);
    const payload = {
      guest_name: guestName,
      ...form,
    };
    const { error } = await fetch("/api/predictions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json().then((data) => ({ ...data, error: data.error ?? null })));
    setSaving(false);
    if (error) {
      setMessage({ type: "err", text: error });
    } else {
      setMessage({ type: "ok", text: existing ? "Predictions updated!" : "Predictions submitted!" });
    }
  };

  const locked = lockSubmissions;
  const canEdit = !!guestName && !locked;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
      <div className="bg-seahawks-navy/80 px-4 py-3 border-b border-seahawks-green/30">
        <h2 className="font-bold text-lg text-seahawks-green">Your Picks</h2>
        <p className="text-sm text-white/70">
          {locked ? "Submissions are locked." : "Select your name and make your predictions."}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Your name</label>
          <select
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full rounded-lg bg-gray-800 border border-white/20 px-4 py-2.5 text-white focus:border-seahawks-green focus:outline-none focus:ring-1 focus:ring-seahawks-green [color-scheme:dark]"
            required
          >
            <option value="" className="bg-gray-800 text-white">
              — Select your name —
            </option>
            {GUEST_LIST.map((name) => (
              <option key={name} value={name} className="bg-gray-800 text-white">
                {name}
              </option>
            ))}
          </select>
        </div>

        {QUESTIONS.map((q) => (
          <fieldset
            key={q.id}
            className="rounded-lg border border-white/10 p-4 bg-white/5"
            disabled={!canEdit}
          >
            <legend className="text-sm font-medium text-white/90 mb-2">
              {q.id}. {q.text} <span className="text-superbowl-gold">({q.pts} pt{q.pts !== 1 ? "s" : ""})</span>
            </legend>
            {q.type === "overtime" ? (
              <div className="flex flex-wrap gap-3">
                {OT_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 cursor-pointer rounded-lg border-2 px-4 py-2 transition ${
                      form[`q${q.id}`] === opt
                        ? "border-superbowl-gold bg-superbowl-gold/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt}
                      checked={form[`q${q.id}`] === opt}
                      onChange={() => setForm((f) => ({ ...f, [`q${q.id}`]: opt }))}
                      className="sr-only"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {(QUESTION_IDS_WITH_TIE.includes(q.id as (typeof QUESTION_IDS_WITH_TIE)[number])
                  ? TEAM_OPTIONS_WITH_TIE
                  : TEAM_OPTIONS
                ).map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 cursor-pointer rounded-lg border-2 px-4 py-2 transition ${
                      form[`q${q.id}`] === opt
                        ? opt === "Seahawks"
                          ? "border-seahawks-green bg-seahawks-green/20"
                          : opt === "Patriots"
                            ? "border-patriots-red bg-patriots-red/20"
                            : "border-superbowl-gold bg-superbowl-gold/20"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      value={opt}
                      checked={form[`q${q.id}`] === opt}
                      onChange={() => setForm((f) => ({ ...f, [`q${q.id}`]: opt }))}
                      className="sr-only"
                    />
                    {(opt === "Seahawks" || opt === "Patriots") && <TeamLogo team={opt} size="sm" />}
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        ))}

        {message && (
          <p
            className={
              message.type === "ok"
                ? "text-seahawks-green text-sm"
                : "text-patriots-red text-sm"
            }
          >
            {message.text}
          </p>
        )}

        {canEdit && (
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-seahawks-green text-seahawks-navy font-bold py-3 px-4 hover:bg-seahawks-green-light transition disabled:opacity-50"
          >
            {saving ? "Saving…" : existing ? "Update my picks" : "Submit my picks"}
          </button>
        )}
      </form>
    </div>
  );
}
