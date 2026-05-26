"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase not configured.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, avatar: "🚀" } },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm, or sign in.");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <GlassPanel className="w-full max-w-md p-8">
        <h1 className="text-xl font-bold">Create account</h1>
        <p className="mt-1 text-sm text-[var(--foreground-soft)]">
          Start your DailyOS journey
        </p>
        <div className="mt-6 space-y-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password (6+ chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={signup} disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Back to login
          </Link>
        </p>
      </GlassPanel>
    </div>
  );
}
