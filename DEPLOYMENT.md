# DailyOS — Production Deployment Guide

Deploy path: **GitHub → Vercel → add env vars → deploy**.

## 1. Push to GitHub

From the `dailyos` folder:

```bash
git add -A
git status   # confirm .env / .env.local are NOT listed
git commit -m "Production-ready DailyOS"
git push -u origin main
```

Required in the repo: `package-lock.json`, `prisma/schema.prisma`, `src/`, `public/`, `.env.example`.

Never commit: `.env`, `.env.local`, `node_modules/`, `.next/`.

## 2. Import on Vercel

1. [vercel.com/new](https://vercel.com/new) → Import Git Repository
2. Root directory: `dailyos` (if monorepo) or `.` (if repo root is the app)
3. Framework: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Install command: `npm ci` (uses lockfile)

## 3. Environment variables

### Minimum (guest mode + landing — deploy succeeds)

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

No database or Supabase required. Users can use **Continue as guest**; data stays in the browser.

### Auth (Supabase)

| Variable | Where to find |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page (anon / public key) |

In Supabase → Authentication → URL configuration, add:

- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

### Database sync (optional)

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Supabase → Database → Connection string (pooler) |
| `DIRECT_URL` | Direct connection (migrations / `db push`) |

After first deploy with real DB URLs:

```bash
npx prisma db push
```

Run locally with production `DATABASE_URL` in `.env`, or use Vercel CLI / CI once.

### AI (optional)

| Variable | Notes |
|----------|--------|
| `OPENAI_API_KEY` | Real `sk-...` key; placeholder values are ignored |

## 4. Post-deploy checks

- [ ] `/` — landing page
- [ ] `/login` → guest mode → `/dashboard`
- [ ] Widgets load on dashboard
- [ ] `/notes`, `/focus`, `/tasks` work
- [ ] `/api/ai` returns a friendly message if OpenAI is not set

## 5. Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `scripts/ensure-prisma-env.mjs` is committed; redeploy |
| OAuth redirect error | Match Supabase redirect URL to `/auth/callback` on your domain |
| Auth buttons do nothing | Set real Supabase URL + anon key (not `.env.example` placeholders) |
| DB sync fails | Run `db push`; verify `DATABASE_URL` is a real Postgres URL |

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `lint`, `typecheck`, and `build` on every push to `main`.
