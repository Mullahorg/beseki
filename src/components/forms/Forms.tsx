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
import { vehicleName } from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {loading ? "Sending…" : children}
    </Button>
  );
}

/* --------------------------------- contact -------------------------------- */

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string | undefined }) {
  const { state, submit, reset } = useEnquiry("contact");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: defaultSubject, message: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (state === "success") {
    return (
      <FormSuccess
        title="Thank you — your enquiry has been sent."
        message="Our team will reply as soon as possible. If it is urgent, WhatsApp us on 0721 886656."
        onReset={() => {
          setForm({ name: "", phone: "", email: "", subject: defaultSubject, message: "" });
          reset();
        }}
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
          message: validators.required(form.message, "Message"),
        };
        const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
        setErrors(clean);
        if (Object.keys(clean).length) return;
        await submit({ ...form, subject: form.subject || "General enquiry" });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="c-name" required error={errors["name"]}>
          <TextInput id="c-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
        </Field>
        <Field label="Phone number" htmlFor="c-phone" required error={errors["phone"]}>
          <TextInput id="c-phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="0722 000 000" invalid={!!errors["phone"]} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" htmlFor="c-email" error={errors["email"]}>
          <TextInput id="c-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" invalid={!!errors["email"]} />
        </Field>
        <Field label="Subject" htmlFor="c-subject">
          <TextInput id="c-subject" value={form.subject} onChange={set("subject")} placeholder="What is your enquiry about?" />
        </Field>
      </div>
      <Field label="Message" htmlFor="c-message" required error={errors["message"]}>
        <TextArea id="c-message" value={form.message} onChange={set("message")} placeholder="Tell us how we can help." invalid={!!errors["message"]} />
      </Field>
      <SubmitButton loading={state === "loading"}>Send Enquiry</SubmitButton>
    </form>
  );
}

/* ------------------------------- appointment ------------------------------ */

export function AppointmentForm({ defaultVehicle = "" }: { defaultVehicle?: string }) {
  const { state, submit, reset } = useEnquiry("appointment");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle: defaultVehicle,
    date: "",
    time: "",
    appointmentType: "Showroom Visit",
    message: "",
  });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (state === "success") {
    return (
      <FormSuccess
        title="Your visit request has been received."
        message="We will confirm your appointment by phone or WhatsApp before the time you selected."
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
          date: validators.required(form.date, "Preferred date"),
        };
        const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
        setErrors(clean);
        if (Object.keys(clean).length) return;
        await submit({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: `${form.appointmentType} — ${form.date}`,
          message: form.message,
          details: {
            vehicle: form.vehicle || null,
            date: form.date,
            time: form.time || null,
            appointmentType: form.appointmentType,
          },
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="a-name" required error={errors["name"]}>
          <TextInput id="a-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
        </Field>
        <Field label="Phone number" htmlFor="a-phone" required error={errors["phone"]}>
          <TextInput id="a-phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="0722 000 000" invalid={!!errors["phone"]} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" htmlFor="a-email" error={errors["email"]}>
          <TextInput id="a-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" invalid={!!errors["email"]} />
        </Field>
        <Field label="Appointment type" htmlFor="a-type" required>
          <SelectInput id="a-type" value={form.appointmentType} onChange={set("appointmentType")}>
            <option>Showroom Visit</option>
            <option>Test Drive</option>
            <option>Video Call</option>
          </SelectInput>
        </Field>
      </div>
      <Field label="Vehicle of interest" htmlFor="a-vehicle" hint="Leave blank if you are still deciding.">
        <SelectInput id="a-vehicle" value={form.vehicle} onChange={set("vehicle")}>
          <option value="">Not sure yet</option>
          {vehicles.map((v) => (
            <option key={v.id} value={vehicleName(v)}>
              {vehicleName(v)}
            </option>
          ))}
        </SelectInput>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor="a-date" required error={errors["date"]}>
          <TextInput id="a-date" type="date" value={form.date} onChange={set("date")} invalid={!!errors["date"]} />
        </Field>
        <Field label="Preferred time" htmlFor="a-time">
          <TextInput id="a-time" type="time" value={form.time} onChange={set("time")} />
        </Field>
      </div>
      <Field label="Message" htmlFor="a-message">
        <TextArea id="a-message" value={form.message} onChange={set("message")} placeholder="Anything we should know before your visit?" />
      </Field>
      <SubmitButton loading={state === "loading"}>Schedule a Visit</SubmitButton>
    </form>
  );
}

/* -------------------------------- test drive ------------------------------ */

export function TestDriveForm({ vehicle }: { vehicle: string }) {
  const { state, submit, reset } = useEnquiry("test_drive");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", message: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (state === "success") {
    return (
      <FormSuccess
        title="Test drive request sent."
        message={`We will call you to confirm a time to drive the ${vehicle}.`}
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
          subject: `Test drive — ${vehicle}`,
          message: form.message,
          details: { vehicle, date: form.date || null },
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="td-name" required error={errors["name"]}>
          <TextInput id="td-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
        </Field>
        <Field label="Phone number" htmlFor="td-phone" required error={errors["phone"]}>
          <TextInput id="td-phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="0722 000 000" invalid={!!errors["phone"]} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" htmlFor="td-email" error={errors["email"]}>
          <TextInput id="td-email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" invalid={!!errors["email"]} />
        </Field>
        <Field label="Preferred date" htmlFor="td-date">
          <TextInput id="td-date" type="date" value={form.date} onChange={set("date")} />
        </Field>
      </div>
      <Field label="Message" htmlFor="td-message">
        <TextArea id="td-message" value={form.message} onChange={set("message")} placeholder={`Anything you'd like to check on the ${vehicle}?`} />
      </Field>
      <SubmitButton loading={state === "loading"}>Book a Test Drive</SubmitButton>
    </form>
  );
}

/* ---------------------------------- offer --------------------------------- */

export function OfferForm({ vehicle, askingPrice }: { vehicle: string; askingPrice: number }) {
  const { state, submit, reset } = useEnquiry("offer");
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState({ name: "", phone: "", offer: "", message: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (state === "success") {
    return (
      <FormSuccess
        title="Offer received."
        message={`Thank you. We will review your offer on the ${vehicle} and come back to you.`}
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
          offer: validators.required(form.offer, "Your offer"),
        };
        const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
        setErrors(clean);
        if (Object.keys(clean).length) return;
        await submit({
          name: form.name,
          phone: form.phone,
          subject: `Offer — ${vehicle}`,
          message: form.message,
          details: { vehicle, askingPrice, offer: form.offer },
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="of-name" required error={errors["name"]}>
          <TextInput id="of-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
        </Field>
        <Field label="Phone number" htmlFor="of-phone" required error={errors["phone"]}>
          <TextInput id="of-phone" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="0722 000 000" invalid={!!errors["phone"]} />
        </Field>
      </div>
      <Field label="Your offer (KES)" htmlFor="of-offer" required error={errors["offer"]}>
        <TextInput id="of-offer" inputMode="numeric" value={form.offer} onChange={set("offer")} placeholder="e.g. 8000000" invalid={!!errors["offer"]} />
      </Field>
      <Field label="Message" htmlFor="of-message">
        <TextArea id="of-message" value={form.message} onChange={set("message")} placeholder="Add any conditions or questions." />
      </Field>
      <SubmitButton loading={state === "loading"}>Submit Offer</SubmitButton>
    </form>
  );
}

/* --------------------------------- review --------------------------------- */

export function ReviewForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", rating: "5", vehicle: "", review: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (done) {
    return (
      <FormSuccess
        title="Thank you for your review."
        message="Reviews are checked by our team before they appear on the site."
        onReset={() => {
          setForm({ name: "", rating: "5", vehicle: "", review: "" });
          setDone(false);
        }}
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
          review: validators.required(form.review, "Review"),
        };
        const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
        setErrors(clean);
        if (Object.keys(clean).length) return;
        setLoading(true);
        const { error } = await supabase.from("reviews").insert({
          customer_name: form.name.trim(),
          rating: Number(form.rating),
          vehicle: form.vehicle.trim() || null,
          review: form.review.trim(),
        });
        setLoading(false);
        if (error) {
          toast.error("We couldn't save your review", { description: "Please try again in a moment." });
          return;
        }
        toast.success("Review submitted", { description: "It will appear once our team has checked it." });
        setDone(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="rv-name" required error={errors["name"]}>
          <TextInput id="rv-name" value={form.name} onChange={set("name")} placeholder="e.g. Amina Said" invalid={!!errors["name"]} />
        </Field>
        <Field label="Rating" htmlFor="rv-rating" required>
          <SelectInput id="rv-rating" value={form.rating} onChange={set("rating")}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} out of 5
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <Field label="Vehicle purchased" htmlFor="rv-vehicle">
        <TextInput id="rv-vehicle" value={form.vehicle} onChange={set("vehicle")} placeholder="e.g. Toyota Alphard 2022" />
      </Field>
      <Field label="Your review" htmlFor="rv-review" required error={errors["review"]}>
        <TextArea id="rv-review" value={form.review} onChange={set("review")} placeholder="Tell others about your experience with us." invalid={!!errors["review"]} />
      </Field>
      <SubmitButton loading={loading}>Leave a Review</SubmitButton>
    </form>
  );
}
