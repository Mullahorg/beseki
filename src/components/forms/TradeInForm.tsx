import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function TradeInForm() {
  const { state, submit, reset } = useEnquiry("trade_in");
  const [errors, setErrors] = useState<Errors>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    transmission: "Automatic",
    condition: "Good",
    registration: "",
    expectedPrice: "",
    notes: "",
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (state === "success") {
    return (
      <FormSuccess
        title="Trade-in request received."
        message="We will review the details you sent and come back to you with an indicative figure. A physical inspection is needed before any final offer."
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
          make: validators.required(form.make, "Make"),
          model: validators.required(form.model, "Model"),
          year: validators.required(form.year, "Year of manufacture"),
        };
        const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
        setErrors(clean);
        if (Object.keys(clean).length) return;
        await submit({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: `Trade-in — ${form.make} ${form.model} ${form.year}`,
          message: form.notes,
          details: {
            make: form.make,
            model: form.model,
            year: form.year,
            mileage: form.mileage || null,
            transmission: form.transmission,
            condition: form.condition,
            registration: form.registration || null,
            expectedPrice: form.expectedPrice || null,
            photoCount: photos.length,
          },
        });
      }}
      className="space-y-8"
    >
      <fieldset className="space-y-5">
        <legend className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="ti-name" required error={errors["name"]}>
            <TextInput id="ti-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
          </Field>
          <Field label="Phone number" htmlFor="ti-phone" required error={errors["phone"]}>
            <TextInput id="ti-phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="0722 000 000" invalid={!!errors["phone"]} />
          </Field>
        </div>
        <Field label="Email address" htmlFor="ti-email" error={errors["email"]}>
          <TextInput id="ti-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" invalid={!!errors["email"]} />
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Your vehicle</legend>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Make" htmlFor="ti-make" required error={errors["make"]}>
            <TextInput id="ti-make" value={form.make} onChange={set("make")} placeholder="e.g. Toyota" invalid={!!errors["make"]} />
          </Field>
          <Field label="Model" htmlFor="ti-model" required error={errors["model"]}>
            <TextInput id="ti-model" value={form.model} onChange={set("model")} placeholder="e.g. Premio" invalid={!!errors["model"]} />
          </Field>
          <Field label="Year" htmlFor="ti-year" required error={errors["year"]}>
            <TextInput id="ti-year" inputMode="numeric" value={form.year} onChange={set("year")} placeholder="e.g. 2016" invalid={!!errors["year"]} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Mileage (km)" htmlFor="ti-mileage">
            <TextInput id="ti-mileage" inputMode="numeric" value={form.mileage} onChange={set("mileage")} placeholder="e.g. 98000" />
          </Field>
          <Field label="Transmission" htmlFor="ti-trans" required>
            <SelectInput id="ti-trans" value={form.transmission} onChange={set("transmission")}>
              <option>Automatic</option>
              <option>Manual</option>
            </SelectInput>
          </Field>
          <Field label="Condition" htmlFor="ti-condition" required>
            <SelectInput id="ti-condition" value={form.condition} onChange={set("condition")}>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
              <option>Needs work</option>
            </SelectInput>
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Registration number" htmlFor="ti-reg">
            <TextInput id="ti-reg" value={form.registration} onChange={set("registration")} placeholder="e.g. KDA 123A" />
          </Field>
          <Field label="Expected price (KES)" htmlFor="ti-price">
            <TextInput id="ti-price" inputMode="numeric" value={form.expectedPrice} onChange={set("expectedPrice")} placeholder="e.g. 1500000" />
          </Field>
        </div>
        <Field
          label="Photos"
          htmlFor="ti-photos"
          hint="Front, rear, both sides and the interior help us give a closer estimate."
        >
          <input
            id="ti-photos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files ?? []).map((f) => f.name))}
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm file:mr-3 file:rounded file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
        </Field>
        {photos.length ? (
          <p className="text-xs text-muted-foreground">
            {photos.length} photo{photos.length > 1 ? "s" : ""} selected. Please also send them to us on WhatsApp so we can view them.
          </p>
        ) : null}
        <Field label="Notes" htmlFor="ti-notes">
          <TextArea id="ti-notes" value={form.notes} onChange={set("notes")} placeholder="Service history, accident history, anything else we should know." />
        </Field>
      </fieldset>

      <Button type="submit" size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
        {state === "loading" ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
        {state === "loading" ? "Sending…" : "Request Trade-In Estimate"}
      </Button>
    </form>
  );
}
