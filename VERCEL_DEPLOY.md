# Deploy to Vercel (Hobby / Free)

## 1. Push your project to GitHub

If you haven’t already:

1. Create a new repo at [github.com/new](https://github.com/new) (e.g. `superbowl-prediction-app`), **don’t** add a README.
2. In a terminal (in your project folder):

   ```bash
   cd C:\Users\ronak\superbowl-prediction-app
   git init
   git add .
   git commit -m "Super Bowl LX prediction app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

## 2. Import the project on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** the repo you just pushed (e.g. `superbowl-prediction-app`).
4. Leave **Framework Preset** as **Next.js** and **Root Directory** empty. Click **Deploy** (you can add env vars in the next step before the first deploy, or right after).

## 3. Add environment variables

Before or after the first deploy:

1. Open your project on Vercel → **Settings** → **Environment Variables**.
2. Add these (same values as in your `.env.local`):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (from Dashboard → Settings → API) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role/secret key |
   | `ADMIN_PASSWORD` | Your chosen admin password (e.g. `superbowl2026`) |

3. For each variable, leave **Environment** as **Production** (and optionally enable Preview if you use branches).
4. Click **Save**.

## 4. Redeploy (if you added env vars after the first deploy)

- Go to **Deployments** → open the **⋯** on the latest deployment → **Redeploy**.

Your app will be live at:

**https://your-project-name.vercel.app**

(Exact URL is shown on the project overview and after each deploy.)

Share that link so others can open the app in the browser.
