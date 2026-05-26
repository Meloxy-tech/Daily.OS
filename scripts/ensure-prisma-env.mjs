#!/usr/bin/env node
/**
 * Prisma requires DATABASE_URL / DIRECT_URL at generate time.
 * Vercel builds without a database still succeed using local fallbacks.
 * Runtime uses isDatabaseConfigured() — dummy URLs are never used for queries.
 */
const fallback =
  "postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=public";

if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = fallback;
}

if (!process.env.DIRECT_URL?.trim()) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}
