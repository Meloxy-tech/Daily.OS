# Production Deployment Checklist

Before deploying Daily.OS to production, complete these steps.

## Pre-Deployment ✓

- [ ] **Repository clean** — `git status` shows no uncommitted changes
- [ ] **Main branch updated** — `git pull origin main`
- [ ] **Validation passes** — `npm run validate` (lint + type-check + build)
- [ ] **Guest mode tested** — Visit `/login` → "Continue as guest" → `/dashboard` → verify widgets load
- [ ] **Dependencies current** — `npm outdated` shows no security vulnerabilities

## Vercel Deployment

### 1. Import Repository
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Select **Meloxy-tech/Daily.OS**
- [ ] Root directory: `.` (app is in repo root)
- [ ] Framework: **Next.js** (auto-detected)
- [ ] Build command: `npm run build` (default)
- [ ] Install command: `npm ci` (default)

### 2. Environment Variables (Minimum)

Add these in **Vercel → Settings → Environment Variables**:

```
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

This alone enables:
- ✅ Landing page & guest mode
- ✅ SEO & sitemap
- ✅ OAuth redirect URLs
- ❌ Database sync (optional)
- ❌ AI assistant (optional)

### 3. Deploy

- [ ] Click **Deploy**
- [ ] Wait for build to complete (~2-3 min)
- [ ] Visit Vercel's auto-generated URL (e.g., `https://daily-os.vercel.app`)

### 4. Post-Deploy Smoke Tests

**Landing Page**
- [ ] `/` loads without errors
- [ ] Badges, screenshots, FAQ visible
- [ ] Navigation links work

**Guest Mode**
- [ ] `/login` → "Continue as guest"
- [ ] Dashboard `/dashboard` loads
- [ ] Widgets (Notes, Tasks, Focus, etc.) render
- [ ] Create a note → verify it persists (IndexedDB)
- [ ] Create a task → verify Kanban drag/drop works

**Production Domain** (if custom domain)
- [ ] Alias domain in Vercel
- [ ] OAuth callback URL in Supabase matches your domain

---

## Optional: Database & Auth

### Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. Wait for project creation (~2 min)
3. Copy **Project URL** and **anon key** from Settings → API

### Add to Vercel

In **Vercel → Settings → Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Redeploy:
- [ ] Click **Redeploy** on the latest deployment

### Configure OAuth in Supabase

1. Supabase → Authentication → Providers → Email (enable)
2. Supabase → Authentication → Providers → Google (enable)
3. Supabase → Authentication → URL Configuration
   - Site URL: `https://your-domain.com`
   - Redirect URLs: `https://your-domain.com/auth/callback`

### Sync Database (optional)

If you want to persist notes, tasks, etc. to your Postgres database:

1. Supabase → Database → Connection Pooler
   - Copy connection string → `DATABASE_URL` in Vercel
2. Supabase → Database → Connection String (direct)
   - Copy connection string → `DIRECT_URL` in Vercel
3. Redeploy in Vercel
4. Run once locally (or in Vercel CLI):
   ```bash
   npm run db:push
   ```

Test:
- [ ] Create a note → refresh page → note persists
- [ ] Verify Prisma Studio: `npm run db:studio`

### AI Assistant (optional)

1. Get API key from [platform.openai.com](https://platform.openai.com)
2. Add to Vercel:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Redeploy
4. Test: `/dashboard` → sidebar → type in AI assistant → response appears

---

## Post-Deployment Monitoring

- [ ] **Logs** — Vercel → Deployments → Latest → View logs (check for errors)
- [ ] **Performance** — Vercel → Analytics tab (check Core Web Vitals)
- [ ] **Errors** — Sentry or similar (if integrated)
- [ ] **Uptime** — Set up monitoring via Vercel or UptimeRobot

---

## Rollback

If deployment has critical issues:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Vercel will auto-redeploy
```

Or in Vercel UI: **Deployments** → select previous successful deployment → **Redeploy**.

---

## Support

- **Vercel Docs** — https://vercel.com/docs
- **Next.js Docs** — https://nextjs.org/docs
- **Supabase Docs** — https://supabase.com/docs
- **GitHub Issues** — https://github.com/Meloxy-tech/Daily.OS/issues
