import { getEnv, isPlaceholderValue } from "@/lib/env";

/** Returns true only when a real OpenAI key is configured (not .env.example placeholders). */
export function isOpenAIConfigured(): boolean {
  const key = getEnv("OPENAI_API_KEY");
  if (!key) return false;
  if (!key.startsWith("sk-")) return false;
  if (isPlaceholderValue(key)) return false;
  if (key.length < 20) return false;
  return true;
}
