import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Loader2,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { FinancingCalculator } from "@/components/forms/FinancingCalculator";
import {
  Field,
  FormSuccess,
  SelectInput,
  TextArea,
  TextInput,
  useEnquiry,
  validators,
  type Errors,
} from "@/components/forms/FormKit";
import { vehicleName } from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/financing")({
  head: () => ({
    meta: [
      {
        title: "Car Financing in Mombasa | BESEKI COMPANY LIMITED",
      },
      {
        name: "description",
        content:
          "Explore car financing options in Mombasa with BESEKI COMPANY LIMITED. Estimate an indicative monthly payment and request financing information from our team.",
      },
      {
        property: "og:title",
        content:
          "Car Financing in Mombasa | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Estimate an indicative monthly car payment and speak with BESEKI about financing your next vehicle.",
      },
      {
        property: "og:url",
        content: "/financing",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/financing",
      },
    ],
  }),

  component: FinancingPage,
});

function FinancingRequestForm() {
  const vehicles = useVehicles();

  const { state, submit, reset } =
    useEnquiry("financing");

  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: "",
    deposit: "",
    message: "",
  });

  const set =
    (key: keyof typeof form) =>
    (event: { target: { value: string } }) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));

      if (errors[key]) {
        setErrors((current) => {
          const next = { ...current };
          delete next[key];
          return next;
        });
      }
    };

  if (state === "success") {
    return (
      <FormSuccess
        title="Request received."
        message="Thank you. Our team will get in touch to discuss the vehicle, deposit and financing options that may suit you."
        onReset={() => reset()}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();

        const next: Errors = {
          name: validators.required(
            form.name,
            "Name",
          ),
          phone:
            validators.required(
              form.phone,
              "Phone number",
            ) ||
            validators.phone(form.phone),
          email: validators.email(
            form.email,
            true,
          ),
        };

        const clean = Object.fromEntries(
          Object.entries(next).filter(
            ([, value]) => value,
          ),
        );

        setErrors(clean);

        if (Object.keys(clean).length) {
          return;
        }

        await submit({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: "Financing information request",
          message: form.message,
          details: {
            vehicle: form.vehicle || null,
            deposit: form.deposit || null,
          },
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          htmlFor="fi-name"
          required
          error={errors["name"]}
        >
          <TextInput
            id="fi-name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Amina Said"
            invalid={!!errors["name"]}
          />
        </Field>

        <Field
          label="Phone number"
          htmlFor="fi-phone"
          required
          error={errors["phone"]}
        >
          <TextInput
            id="fi-phone"
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="0722 000 000"
            invalid={!!errors["phone"]}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email address"
          htmlFor="fi-email"
          error={errors["email"]}
        >
          <TextInput
            id="fi-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
            invalid={!!errors["email"]}
          />
        </Field>

        <Field
          label="Deposit you have available (KES)"
          htmlFor="fi-deposit"
        >
          <TextInput
            id="fi-deposit"
            inputMode="numeric"
            value={form.deposit}
            onChange={set("deposit")}
            placeholder="e.g. 700000"
          />
        </Field>
      </div>

      <Field
        label="Vehicle of interest"
        htmlFor="fi-vehicle"
      >
        <SelectInput
          id="fi-vehicle"
          value={form.vehicle}
          onChange={set("vehicle")}
        >
          <option value="">
            Not sure yet
          </option>

          {vehicles.map((vehicle) => (
            <option
              key={vehicle.id}
              value={vehicleName(vehicle)}
            >
              {vehicleName(vehicle)}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field
        label="Anything else we should know?"
        htmlFor="fi-message"
      >
        <TextArea
          id="fi-message"
          value={form.message}
          onChange={set("message")}
          placeholder="Employment type, preferred repayment period, or any questions you have."
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={state === "loading"}
          className="w-full sm:w-auto"
        >
          {state === "loading" ? (
            <Loader2
              className="size-4 animate-spin"
              aria-hidden="true"
            />
          ) : null}

          {state === "loading"
            ? "Sending…"
            : "Request Financing Information"}
        </Button>

        <a
          href={whatsappLink(waMessages.general)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <MessageCircle
            className="size-4"
            aria-hidden="true"
          />

          Prefer WhatsApp?
        </a>
      </div>
    </form>
  );
}

function FinancingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* ================================================================ */}
      {/* HERO */}
      {/* ================================================================ */}

      <section className="border-b border-border bg-muted/20">
        <div className="container-page py-14 sm:py-16 md:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-16">
            <div className="max-w-4xl">
              <div className="mb-6 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-10 bg-primary"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  Financing
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                Make the monthly figure
                <span className="block text-muted-foreground">
                  work for you.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                You don't always need to pay for a vehicle all
                at once. Start with an indicative estimate, then
                talk to our team about the financing options
                available for the car you're considering.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#calculator">
                  <Button size="lg">
                    Calculate a payment
                    <ArrowRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Button>
                </a>

                <a href="#financing-request">
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    Request information
                  </Button>
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm font-semibold">
                A simple starting point
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use the calculator to understand how the vehicle
                price, deposit, loan period and interest rate can
                affect the monthly payment.
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  BESEKI COMPANY LIMITED
                </p>

                <p className="mt-2 text-sm leading-6 text-foreground">
                  Railway Station, Along Lumumba Road,
                  Mombasa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* CALCULATOR */}
      {/* ================================================================ */}

      <section
        id="calculator"
        className="border-b border-border"
      >
        <div className="container-page py-14 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <div className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-primary"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  Estimate
                </span>
              </div>

              <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
                See what the numbers could look like.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
                Adjust the figures to explore an indicative
                monthly payment before speaking with our team.
              </p>

              <div className="mt-8 border-t border-border pt-6">
                <div className="flex gap-3">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-muted-foreground">
                    Increase the deposit to reduce the amount
                    financed.
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-muted-foreground">
                    A longer repayment period can lower the
                    monthly figure but may increase total
                    interest.
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-muted-foreground">
                    The calculator is an estimate, not a lender
                    approval or final quotation.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border bg-card p-5 sm:p-7 md:p-8 lg:p-10">
              <FinancingCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* HOW IT WORKS */}
      {/* ================================================================ */}

      <section className="border-b border-border bg-muted/20">
        <div className="container-page py-14 md:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-primary"
                />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  How it works
                </span>
              </div>

              <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
                Three straightforward steps.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
                We keep the first conversation simple. You
                choose the vehicle, tell us what you can put
                towards it, and we help you understand the next
                step.
              </p>
            </div>

            <div className="border-t border-border">
              {[
                {
                  number: "01",
                  title: "Choose the vehicle",
                  text: "Pick a vehicle from our stock, or tell us what kind of car you are looking for.",
                },
                {
                  number: "02",
                  title: "Share your details",
                  text: "Tell us about your deposit and the repayment period you would prefer.",
                },
                {
                  number: "03",
                  title: "Discuss your options",
                  text: "Our team can connect you with a suitable financing partner and guide you through the information required.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="grid gap-4 border-b border-border py-7 sm:grid-cols-[70px_1fr] sm:gap-6"
                >
                  <p className="text-xs font-bold tracking-[0.14em] text-primary">
                    {step.number}
                  </p>

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINANCING REQUEST */}
      {/* ================================================================ */}

      <section
        id="financing-request"
        className="container-page py-14 md:py-20 lg:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-primary"
              />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Talk to BESEKI
              </span>
            </div>

            <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
              Ready to talk through the options?
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground md:text-base">
              Send us a few details and our team will get in
              touch. You don't need to have everything figured
              out before you contact us.
            </p>

            <div className="mt-8 border-y border-border py-6">
              <div className="flex items-start gap-3">
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center bg-primary text-[11px] font-bold text-primary-foreground">
                  1
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    Tell us what you're considering
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Vehicle, budget and deposit are enough to
                    start the conversation.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <span className="mt-1 flex size-6 shrink-0 items-center justify-center bg-primary text-[11px] font-bold text-primary-foreground">
                  2
                </span>

                <div>
                  <p className="text-sm font-semibold">
                    We'll get back to you
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Our team will discuss the available route
                    and what information is needed next.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={whatsappLink(waMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <MessageCircle
                className="size-4"
                aria-hidden="true"
              />

              Prefer to start on WhatsApp?

              <ChevronRight
                className="size-4"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="border border-border bg-card p-5 sm:p-7 md:p-8 lg:p-10">
            <h3 className="text-xl font-semibold tracking-tight">
              Request financing information
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Fill in the form below and our team will contact
              you to discuss the vehicle and financing options.
            </p>

            <div className="mt-7">
              <FinancingRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* IMPORTANT NOTE */}
      {/* ================================================================ */}

      <section className="border-y border-border bg-muted/20">
        <div className="container-page py-10 md:py-12">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
            <div className="flex size-10 items-center justify-center border border-border bg-background">
              <span className="text-sm font-bold text-primary">
                i
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold">
                About the figures shown
              </p>

              <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground md:text-sm">
                Calculator results are indicative only. Actual
                financing terms, interest rates, fees, eligibility
                and repayment amounts are determined by the
                relevant financing provider.
              </p>
            </div>

            <Link to="/contact">
              <Button variant="outline">
                Talk to BESEKI
                <ArrowRight
                  className="size-4"
                  aria-hidden="true"
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA */}
      {/* ================================================================ */}

      <section className="container-page py-14 md:py-20">
        <div className="bg-primary px-6 py-10 text-primary-foreground md:px-10 md:py-14 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
                Your next car
              </p>

              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] md:text-4xl">
                Found the vehicle you want?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 md:text-base">
                Browse the current inventory, choose a vehicle
                and then come to the showroom to see it for
                yourself.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/inventory">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                >
                  Browse inventory
                  <ArrowRight
                    className="size-4"
                    aria-hidden="true"
                  />
                </Button>
              </Link>

              <a
                href={whatsappLink(waMessages.general)}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  WhatsApp BESEKI
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
