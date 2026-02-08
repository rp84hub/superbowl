"use client";

type Team = "Seahawks" | "Patriots";

const styles: Record<Team, string> = {
  Seahawks: "bg-seahawks-navy border-seahawks-green text-seahawks-green",
  Patriots: "bg-patriots-navy border-patriots-red text-patriots-red",
};

export function TeamLogo({ team, size = "md" }: { team: Team; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" };
  const initial = team === "Seahawks" ? "SEA" : "NE";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border-2 font-bold ${styles[team]} ${sizeClasses[size]}`}
      title={team}
    >
      {initial}
    </span>
  );
}
