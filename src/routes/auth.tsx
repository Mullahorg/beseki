import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/forms/FormKit";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { company } from "@/data/company";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      {
        title: "Staff Sign In | BESEKI COMPANY LIMITED",
      },
      {
        name: "description",
        content:
          "Secure staff access to the BESEKI COMPANY LIMITED management area.",
      },
      {
        name: "robots",
        content: "noindex,nofollow",
      },
      {
        property: "og:title",
        content: "Staff Sign In | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Secure staff access to the BESEKI management area.",
      },
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
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) {
        navigate({
          to: "/admin",
          replace: true,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate({
          to: "/admin",
          replace: true,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function onSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please complete the form", {
        description:
          "Enter your email address and password to continue.",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("Password is too short", {
        description:
          "Your password must contain at least 8 characters.",
      });
      return;
    }

    setBusy(true);

    try {
      if (mode === "signup") {
        const { data, error } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              emailRedirectTo:
                window.location.origin + "/auth",
            },
          });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setSent(true);
          return;
        }
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          throw error;
        }
      }
    } catch (err) {
      toast.error(
        mode === "signin"
          ? "Sign in failed"
          : "Account creation failed",
        {
          description:
            err instanceof Error
              ? err.message
              : "Please check your details and try again.",
        },
      );
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    if (busy) {
      return;
    }

    setBusy(true);

    try {
      const result =
        await lovable.auth.signInWithOAuth("google", {
          redirect_uri:
            window.location.origin + "/auth",
        });

      if (result.error) {
        throw result.error;
      }
    } catch (err) {
      setBusy(false);

      toast.error("Google sign in failed", {
        description:
          err instanceof Error
            ? err.message
            : "Please try again or use your email and password.",
      });
    }
  }

  function switchMode() {
    setSent(false);
    setMode((current) =>
      current === "signin" ? "signup" : "signin",
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* ============================================================ */}
        {/* BRAND PANEL */}
        {/* ============================================================ */}

        <section className="relative hidden overflow-hidden bg-[#101319] text-white lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -right-32 top-16 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <span className="flex size-11 items-center justify-center bg-primary text-sm font-black tracking-tight text-primary-foreground">
                  B
                </span>

                <div>
                  <p className="text-sm font-bold tracking-tight">
                    {company.shortName}
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
                    Company Limited
                  </p>
                </div>
              </Link>
            </div>

            <div className="max-w-xl">
              <div className="mb-7 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-primary"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                  Staff portal
                </span>
              </div>

              <h2 className="text-4xl font-semibold leading-[1.04] tracking-[-0.045em] xl:text-6xl">
                Everything behind
                <span className="block text-white/45">
                  the showroom.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/60 xl:text-base">
                Manage vehicles, enquiries, appointments and
                website content from one secure BESEKI
                management area.
              </p>

              <div className="mt-10 border-t border-white/10 pt-7">
                <div className="grid gap-5 sm:grid-cols-3">
                  {[
                    {
                      title: "Inventory",
                      text: "Manage vehicle stock",
                    },
                    {
                      title: "Enquiries",
                      text: "Follow up customers",
                    },
                    {
                      title: "Content",
                      text: "Keep the site current",
                    },
                  ].map((item) => (
                    <div key={item.title}>
                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/45">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40">
              <span>
                {company.name}
              </span>

              <span>
                Mombasa, Kenya
              </span>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* AUTH PANEL */}
        {/* ============================================================ */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-10 lg:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <span className="flex size-10 items-center justify-center bg-primary text-sm font-black text-primary-foreground">
                  B
                </span>

                <div>
                  <p className="text-sm font-bold tracking-tight">
                    {company.shortName}
                  </p>

                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Company Limited
                  </p>
                </div>
              </Link>
            </div>

            {/* Back */}
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft
                className="size-3.5"
                aria-hidden="true"
              />
              Back to website
            </Link>

            {/* Header */}
            <div>
              <div className="mb-5 flex size-10 items-center justify-center border border-border bg-muted/30">
                <ShieldCheck
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                {mode === "signin"
                  ? "Staff access"
                  : "Staff registration"}
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                {mode === "signin"
                  ? "Welcome back."
                  : "Create your staff account."}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {mode === "signin"
                  ? "Sign in to manage the BESEKI dealership website and customer activity."
                  : "Create an account for authorized BESEKI staff access."}
              </p>
            </div>

            {/* Confirmation */}
            {sent ? (
              <div className="mt-8">
                <div className="border border-border bg-muted/20 p-6">
                  <div className="flex size-10 items-center justify-center bg-primary text-primary-foreground">
                    <Check
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    Check your email.
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We've sent a confirmation link to{" "}
                    <strong className="font-semibold text-foreground">
                      {email}
                    </strong>
                    . Confirm your email address, then return
                    here to sign in.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSent(false);
                      setMode("signin");
                    }}
                  >
                    Return to sign in
                    <ArrowRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Form */}
                <form
                  onSubmit={onSubmit}
                  className="mt-8 space-y-5"
                  noValidate
                >
                  <Field
                    label="Email address"
                    htmlFor="a-email"
                    required
                  >
                    <TextInput
                      id="a-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      required
                      placeholder="name@company.com"
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                    />
                  </Field>

                  <Field
                    label="Password"
                    htmlFor="a-pass"
                    required
                  >
                    <TextInput
                      id="a-pass"
                      type="password"
                      autoComplete={
                        mode === "signup"
                          ? "new-password"
                          : "current-password"
                      }
                      value={password}
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                    />
                  </Field>

                  {mode === "signup" && (
                    <div className="flex gap-3 border-t border-border pt-4">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <p className="text-xs leading-5 text-muted-foreground">
                        You'll need to confirm your email address
                        before accessing the management area.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={busy}
                    className="w-full"
                  >
                    {busy ? (
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : null}

                    {busy
                      ? mode === "signin"
                        ? "Signing in…"
                        : "Creating account…"
                      : mode === "signin"
                        ? "Sign in to staff portal"
                        : "Create staff account"}

                    {!busy && (
                      <ArrowRight
                        className="size-4"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="my-7 flex items-center gap-4">
                  <span className="h-px flex-1 bg-border" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Or
                  </span>

                  <span className="h-px flex-1 bg-border" />
                </div>

                {/* Google */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={google}
                  disabled={busy}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                {/* Mode switch */}
                <div className="mt-7 border-t border-border pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {mode === "signin"
                      ? "First time using the staff portal?"
                      : "Already have a staff account?"}
                  </p>

                  <button
                    type="button"
                    onClick={switchMode}
                    disabled={busy}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {mode === "signin"
                      ? "Create a staff account"
                      : "Sign in instead"}

                    <ChevronRightIcon />
                  </button>
                </div>
              </>
            )}

            {/* Security note */}
            <div className="mt-10 flex items-start gap-3 border-t border-border pt-6">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />

              <p className="text-[11px] leading-5 text-muted-foreground">
                This is a restricted staff area. Customer accounts
                are not required to browse vehicles, make enquiries
                or contact BESEKI.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4"
    >
      <path
        fill="currentColor"
        d="M21.35 12.27c0-.77-.07-1.51-.2-2.22H12v4.2h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.37Z"
      />
      <path
        fill="currentColor"
        d="M12 21.99c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.55 0-4.71-1.72-5.49-4.03H3.27v2.53A9.74 9.74 0 0 0 12 21.99Z"
      />
      <path
        fill="currentColor"
        d="M6.51 14.09a5.86 5.86 0 0 1 0-3.74V7.82H3.27a9.99 9.99 0 0 0 0 8.8l3.24-2.53Z"
      />
      <path
        fill="currentColor"
        d="M12 6.32c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.41 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.73 5.32l3.24 2.53C7.29 8.04 9.45 6.32 12 6.32Z"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="size-4"
    >
      <path
        d="m7.5 4.5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
