export const GUEST_LIST = [
  "Deb",
  "Dhara",
  "Dilip",
  "Jaya",
  "Keshu",
  "Kinjal",
  "Krishna",
  "Murali",
  "Neha",
  "Pinak",
  "Prathima",
  "Renu",
  "Richa",
  "Ronak",
  "Samir",
  "Saurabh",
  "Siri",
  "Swati",
  "Vaishali",
] as const;

export type GuestName = (typeof GUEST_LIST)[number];

export const QUESTIONS = [
  { id: 1, text: "Which team will win the opening coin toss?", pts: 1, type: "team" as const },
  { id: 2, text: "Which team will be the first to score any points?", pts: 2, type: "team" as const },
  { id: 3, text: "Which team will score the most points in the 1st quarter?", pts: 2, type: "team" as const },
  { id: 4, text: "Which team will score the most points in the 2nd quarter?", pts: 2, type: "team" as const },
  { id: 5, text: "Which team will have the higher total score at halftime?", pts: 4, type: "team" as const },
  { id: 6, text: "Which team will score the most points in the 3rd quarter?", pts: 2, type: "team" as const },
  { id: 7, text: "Which team will score the most points in the 4th quarter?", pts: 2, type: "team" as const },
  { id: 8, text: "Will the game proceed into Overtime?", pts: 3, type: "overtime" as const },
  { id: 9, text: "Which team will record the most touchdowns?", pts: 4, type: "team" as const },
  { id: 10, text: "Which team will win Super Bowl LX?", pts: 5, type: "team" as const },
] as const;

export const POINTS = [1, 2, 2, 2, 4, 2, 2, 3, 4, 5] as const;

/** Team-only questions (1, 2, 10): no Tie option */
export const TEAM_OPTIONS = ["Seahawks", "Patriots"] as const;
/** Quarter/halftime/td questions (3, 4, 5, 6, 7, 9): include Tie */
export const TEAM_OPTIONS_WITH_TIE = ["Seahawks", "Patriots", "Tie"] as const;
export const OT_OPTIONS = ["Yes", "No"] as const;

/** Question ids that allow Tie (3, 4, 5, 6, 7, 9) */
export const QUESTION_IDS_WITH_TIE = [3, 4, 5, 6, 7, 9] as const;

/** Bonus question: 4th quarter score, Seahawks–Patriots (e.g. 24-21). Not counted in leaderboard. */
export const BONUS_QUESTION = {
  id: 11,
  label: "Bonus: End of 4th quarter score (Seahawks first, then Patriots)",
  placeholder: "e.g. 24-21",
  description: "Correct guess wins a bonus prize. Format: Seahawks score–Patriots score.",
} as const;
