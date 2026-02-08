# Check everything locally before deploying to Vercel

Run these commands **in your project folder** (where `package.json` is) before you push to GitHub / deploy to Vercel.

## 1. Install dependencies (first time or after pulling changes)

```bash
npm install
```

## 2. Type-check and build (catches TypeScript and build errors)

```bash
npm run validate
```

This runs `tsc --noEmit` (type-check only) then `next build`. If either fails, fix the errors before pushing.

## 3. Optional: lint

```bash
npm run lint
```

## 4. Optional: run the app locally

```bash
npm run dev
```

Then open http://localhost:3000 and click through the app and admin page to confirm everything works.

---

**Quick one-liner before every push:**

```bash
npm install && npm run validate
```

If that succeeds, your Vercel build should pass.
