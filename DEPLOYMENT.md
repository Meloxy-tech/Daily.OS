# DailyOS — Production Deployment Guide

Deploy path: **GitHub → Vercel → add env vars → deploy**.

## 1. Push to GitHub

Your commit is local until `git push` succeeds. If you see **401 Authentication failed**, GitHub is rejecting credentials — fix auth first (below), then push.

From the `dailyos` folder:

```bash
git status
git push -u origin main
```

### Fix: `Authentication failed` / `401`

Cursor’s built-in Git often cannot prompt for GitHub login. Use **Terminal.app** or iTerm instead.

**Option A — GitHub CLI (recommended)**

```bash
brew install gh
gh auth login
# Choose: GitHub.com → HTTPS → Login with browser

cd "/Users/vishal/Documents/New project/dailyos"
git push -u origin main
```

**Option B — SSH**

```bash
# Generate key if you don’t have one
ssh-keygen -t ed25519 -C "your@email.com"

# Copy public key, add at github.com → Settings → SSH keys
pbcopy < ~/.ssh/id_ed25519.pub

cd "/Users/vishal/Documents/New project/dailyos"
git remote set-url origin git@github.com:Meloxy-tech/Daily.OS.git
git push -u origin main
```

**Option C — Personal Access Token (HTTPS)**

1. GitHub → Settings → Developer settings → Personal access tokens → Generate (scope: `repo`)
2. Push (Terminal will ask for password — paste the **token**, not your GitHub password):

```bash
cd "/Users/vishal/Documents/New project/dailyos"
git push -u origin main
```

### Create the repo first (if empty)

On GitHub: **New repository** → name `Daily.OS` → do **not** add README (you already have one locally).

Remote should be:

`https://github.com/Meloxy-tech/Daily.OS.git`

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
