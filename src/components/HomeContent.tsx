"use client";

import { useState } from "react";
import { Leaderboard } from "@/components/Leaderboard";
import { PredictionForm } from "@/components/PredictionForm";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";

export function HomeContent() {
  const [guestName, setGuestName] = useState("");

  return (
    <div className="space-y-8">
      <section className="text-center py-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          <span className="text-seahawks-green">Seahawks</span>
          <span className="text-white/80 mx-2">vs</span>
          <span className="text-patriots-red">Patriots</span>
        </h1>
        <p className="text-white/70 text-sm md:text-base">
          Super Bowl LX • 2026 • Submit your picks before kickoff
        </p>
        <p className="text-superbowl-gold text-sm font-medium mt-2">
          Winner will be awarded a gift card.
        </p>
      </section>

      <PredictionForm
        selectedGuest={guestName}
        onGuestChange={setGuestName}
      />

      <ScoreBreakdown guestName={guestName} />

      <Leaderboard />

      <footer className="text-center text-white/50 text-xs pt-6 border-t border-white/10 space-y-1">
        <p>* If the winner is tied, they share the gift card.</p>
      </footer>
    </div>
  );
}
