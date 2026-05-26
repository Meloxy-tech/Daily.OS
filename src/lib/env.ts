/** Shared env helpers — safe on server, edge, and client (NEXT_PUBLIC_* only on client). */

const PLACEHOLDER_MARKERS = [
  "your-project",
  "your-anon-key",
  "your-openai",
  "sk-your",
  "password@db.your-project",
  "placeholder.supabase.co",
] as const;

export function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function isPlaceholderValue(value: string): boolean {
  const lower = value.toLowerCase();
  return PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker));
}

export function isSupabaseConfigured(): boolean {
  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !key) return false;
  if (isPlaceholderValue(url) || isPlaceholderValue(key)) return false;
  return url.startsWith("https://") && url.includes("supabase");
}

export function isDatabaseConfigured(): boolean {
  const url = getEnv("DATABASE_URL");
  if (!url) return false;
  if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
    return false;
  }
  if (isPlaceholderValue(url)) return false;
  return true;
}

export function getAppUrl(): string {
  const url = getEnv("NEXT_PUBLIC_APP_URL");
  if (url && !isPlaceholderValue(url)) {
    return url.replace(/\/$/, "");
  }
  return "https://dailyos.app";
}
