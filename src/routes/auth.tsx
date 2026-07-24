import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin sign in — Beenaz Fashion House" }],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Admin account created. You may now sign in.");
        setMode("signin");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" />
      <header className="border-b border-border/50">
        <div className="container-tight flex h-16 items-center justify-between">
          <a href="/" className="font-display text-2xl font-semibold text-foreground">Beenaz</a>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</a>
        </div>
      </header>

      <main className="container-tight py-16">
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-4xl font-semibold text-foreground">
            {mode === "signin" ? "Admin sign in" : "Create admin account"}
          </h1>
          <p className="mt-2 text-muted-foreground">Manage products and orders.</p>

          <form onSubmit={submit} className="mt-10 space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-lavender-deep disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create admin account"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {mode === "signin" ? "First time? Create admin account →" : "← Back to sign in"}
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            Note: The first account created automatically becomes admin. Additional accounts are regular users.
          </p>
        </div>
      </main>
    </div>
  );
}
