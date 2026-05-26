"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useAppStore } from "@/stores/app-store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AVATARS } from "@/types";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initGuest = useAppStore((s) => s.initGuest);
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState("Explorer");
  const [guestAvatar, setGuestAvatar] = useState(AVATARS[0]);
  const [mode, setMode] = useState<"login" | "guest">("login");

  useEffect(() => {
    if (params.get("guest") === "1") setMode("guest");

    const authError = params.get("error");
    if (authError === "auth_not_configured") {
      toast.error("Sign-in is not configured yet. Use guest mode or add Supabase env vars.");
    } else if (authError === "auth_failed") {
      toast.error("Sign-in failed. Please try again.");
    }
  }, [params]);

  const handleEmailLogin = async () => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase not configured. Use guest mode or add env vars.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser({
        id: user.id,
        supabaseId: user.id,
        name: user.user_metadata?.name ?? email.split("@")[0],
        email: user.email,
        avatar: user.user_metadata?.avatar ?? "🚀",
        isGuest: false,
      });
      router.push("/dashboard");
    }
  };

  const handleGoogle = async () => {
    if (!isSupabaseConfigured()) {
      toast.error("Configure Supabase for Google login.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGuest = () => {
    initGuest(guestName, guestAvatar);
    toast.success("Welcome, guest! Data saved locally.");
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={false}
        className="animate-fade-up w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500">
            D
          </span>
          DailyOS
        </Link>

        <GlassPanel glow className="p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              Start your daily workspace
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-soft)]">
              Use guest mode for instant local setup, or sign in when you want sync.
            </p>
          </div>

          <div className="mb-6 flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-lg py-2 text-sm ${mode === "login" ? "bg-white/10 text-[var(--foreground)]" : "text-[var(--muted)]"}`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("guest")}
              className={`flex-1 rounded-lg py-2 text-sm ${mode === "guest" ? "bg-white/10 text-[var(--foreground)]" : "text-[var(--muted)]"}`}
            >
              Guest
            </button>
          </div>

          {mode === "login" ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[var(--muted)]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-[var(--muted)]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-white/30" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleEmailLogin} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={handleGoogle}>
                <Globe className="h-4 w-4" /> Continue with Google
              </Button>
              <p className="text-center text-xs text-[var(--muted)]">
                No account?{" "}
                <Link href="/signup" className="text-[var(--accent)] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[var(--muted)]">Display name</label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs text-[var(--muted)]">Avatar</label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setGuestAvatar(a)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                        guestAvatar === a
                          ? "bg-[var(--accent)]/20 ring-2 ring-[var(--accent)]"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleGuest}>
                Continue as guest
              </Button>
              <p className="text-center text-[10px] text-white/40">
                Fastest start. Guest data stays local on this device.
              </p>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
          <div className="skeleton-cozy h-8 w-32 rounded-lg" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
