# Super Bowl LX (2026) Prediction App

Seattle Seahawks vs. New England Patriots — guests submit picks, admin sets results, leaderboard updates in real time.

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS**
- **Supabase** (database + realtime)

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the contents of `supabase/schema.sql`.
3. Enable **Realtime** for the tables (Database → Replication): turn on for `predictions` and `results` so the leaderboard updates live.
4. In **Settings → API** copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. App

```bash
cd superbowl-prediction-app
npm install
cp .env.local.example .env.local
```

Edit `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD` (used to access `/admin`)

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Home:** Dropdown to pick your name (from the 19 guests), answer 10 questions with team/Yes–No options, submit. Leaderboard shows all 19 guests with total points and questions correct; updates in real time when admin changes results or new picks are submitted.
- **Admin (`/admin`):** Log in with `ADMIN_PASSWORD`. Set the correct answer for each question (Seahawks / Patriots / Tie/None, or Yes/No for overtime). **Lock submissions** to prevent guests from submitting or editing after kickoff.

## Guest list

Ronak, Prathima, Keshu, Richa, Pinak, Vaishali, Krishna, Renu, Saurabh, Neha, Deb, Swati, Kinjal, Dhara, Siri, Murali, Dilip, Jaya, Samir.

## Points

| # | Question | Pts |
|---|----------|-----|
| 1 | Coin toss | 1 |
| 2 | First to score | 2 |
| 3 | Most in 1st Q | 2 |
| 4 | Most in 2nd Q | 2 |
| 5 | Halftime leader | 4 |
| 6 | Most in 3rd Q | 2 |
| 7 | Most in 4th Q | 2 |
| 8 | Overtime? (Y/N) | 3 |
| 9 | Most touchdowns | 4 |
| 10 | Winner | 5 |

Tie/None on quarter or halftime questions = no points.
