import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/common/Section";
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
import { vehicles, vehicleName } from "@/data/vehicles";

export const Route = createFileRoute("/financing")({
  head: () => ({
    meta: [
      { title: "Car Financing in Mombasa | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Estimate your monthly car repayment and request financing information from BESEKI COMPANY LIMITED in Mombasa. Simple, clear guidance with no jargon.",
      },
      { property: "og:title", content: "Car Financing in Mombasa | BESEKI COMPANY LIMITED" },
      {
        property: "og:description",
        content: "Work out an indicative monthly payment, then request financing information from our team.",
      },
      { property: "og:url", content: "/financing" },
    ],
    links: [{ rel: "canonical", href: "/financing" }],
  }),
  component: FinancingPage,
});

function FinancingRequestForm() {
  const { state, submit, reset } = useEnquiry("financing");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", vehicle: "", deposit: "", message: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (state === "success") {
    return (
      <FormSuccess
        title="Request received."
        message="We will get in touch to talk through the options available for the vehicle you have in mind."
        onReset={() => reset()}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const next: Errors = {
          name: validators.required(form.name, "Name"),
          phone: validators.required(form.phone, "Phone number") || validators.phone(form.phone),
          email: validators.email(form.email, true),
        };
        const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
        setErrors(clean);
        if (Object.keys(clean).length) return;
        await submit({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: "Financing information request",
          message: form.message,
          details: { vehicle: form.vehicle || null, deposit: form.deposit || null },
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fi-name" required error={errors["name"]}>
          <TextInput id="fi-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
        </Field>
        <Field label="Phone number" htmlFor="fi-phone" required error={errors["phone"]}>
          <TextInput id="fi-phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="0722 000 000" invalid={!!errors["phone"]} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" htmlFor="fi-email" error={errors["email"]}>
          <TextInput id="fi-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" invalid={!!errors["email"]} />
        </Field>
        <Field label="Deposit you have available (KES)" htmlFor="fi-deposit">
          <TextInput id="fi-deposit" inputMode="numeric" value={form.deposit} onChange={set("deposit")} placeholder="e.g. 700000" />
        </Field>
      </div>
      <Field label="Vehicle of interest" htmlFor="fi-vehicle">
        <SelectInput id="fi-vehicle" value={form.vehicle} onChange={set("vehicle")}>
          <option value="">Not sure yet</option>
          {vehicles.map((v) => (
            <option key={v.id} value={vehicleName(v)}>
              {vehicleName(v)}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field label="Anything else we should know?" htmlFor="fi-message">
        <TextArea id="fi-message" value={form.message} onChange={set("message")} placeholder="Employment type, preferred repayment period, questions." />
      </Field>
      <Button type="submit" size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
        {state === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {state === "loading" ? "Sending…" : "Request Financing Information"}
      </Button>
    </form>
  );
}

function FinancingPage() {
  return (
    <>
      <PageHero
        eyebrow="Financing"
        title="Drive Away With a Financing Plan That Works for You"
        subtitle="Not everyone pays for a car in one go. If you would rather spread the cost, we will help you understand what the monthly figure might look like and who to talk to."
      />

      <Section>
        <SectionHeading
          eyebrow="Estimate"
          title="Work out an indicative monthly payment"
          subtitle="Change the figures below to see how the deposit, loan period and interest rate affect what you would pay each month."
        />
        <FinancingCalculator />
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-[30px]">Three straightforward steps</h2>
            <ol className="mt-6 space-y-6">
              {[
                { n: "1", t: "Choose the vehicle", c: "Pick the car you want from our stock, or tell us what you are looking for." },
                { n: "2", t: "Share your details", c: "Send us your deposit amount and the repayment period that suits you." },
                { n: "3", t: "We connect you with a lender", c: "We introduce you to a financier and support the paperwork through to collection." },
              ].map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold">{s.t}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">{s.c}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold">Request financing information</h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Fill in the form and our team will call you back to discuss the options.
            </p>
            <div className="mt-6">
              <FinancingRequestForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
