import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/forms/FormKit";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { company } from "@/data/company";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Sign In | BESEKI COMPANY LIMITED" },
      { name: "description", content: "Sign in to manage BESEKI stock, enquiries and website content." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Sign In | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "Sign in to the BESEKI management area." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") navigate({ to: "/admin", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error("Sign in failed", { description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign in failed", { description: "Please try again or use your email and password." });
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-7 shadow-sm">
        <h1 className="text-2xl font-bold">{company.shortName} staff sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is for {company.name} staff. Customers do not need an account.
        </p>

        {sent ? (
          <div className="mt-6 rounded-lg border border-brand-blue/30 bg-brand-blue/5 p-5 text-sm">
            Check <strong>{email}</strong> for a confirmation link, then come back and sign in.
          </div>
        ) : (
          <>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field label="Email address" htmlFor="a-email" required>
                <TextInput
                  id="a-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field label="Password" htmlFor="a-pass" required>
                <TextInput
                  id="a-pass"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  required
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Button type="submit" size="lg" disabled={busy} className="w-full">
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {mode === "signup" ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button variant="outline" size="lg" className="w-full" onClick={google} disabled={busy}>
              Continue with Google
            </Button>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-5 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {mode === "signin" ? "First time here? Create your staff account" : "Already have an account? Sign in"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
