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

export const TEAM_OPTIONS = ["Seahawks", "Patriots", "Tie/None"] as const;
export const OT_OPTIONS = ["Yes", "No"] as const;
