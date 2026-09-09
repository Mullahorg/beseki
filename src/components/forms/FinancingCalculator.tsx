import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/forms/FormKit";
import { formatKes } from "@/lib/whatsapp";

export function FinancingCalculator() {
  const [price, setPrice] = useState("3500000");
  const [deposit, setDeposit] = useState("700000");
  const [years, setYears] = useState("4");
  const [rate, setRate] = useState("14");

  const result = useMemo(() => {
    const p = Number(price) || 0;
    const d = Number(deposit) || 0;
    const n = (Number(years) || 0) * 12;
    const r = (Number(rate) || 0) / 100 / 12;
    const principal = Math.max(p - d, 0);
    if (!principal || !n) return { monthly: 0, principal, total: 0, interest: 0 };
    const monthly = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
    const total = monthly * n;
    return { monthly, principal, total, interest: total - principal };
  }, [price, deposit, years, rate]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Vehicle price (KES)" htmlFor="fc-price" required>
            <TextInput id="fc-price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>
          <Field label="Deposit (KES)" htmlFor="fc-deposit" required>
            <TextInput id="fc-deposit" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value)} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Loan period (years)" htmlFor="fc-years" required>
            <TextInput id="fc-years" inputMode="numeric" value={years} onChange={(e) => setYears(e.target.value)} />
          </Field>
          <Field label="Interest rate (% per year)" htmlFor="fc-rate" required>
            <TextInput id="fc-rate" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          </Field>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          This calculator is an estimate only. It does not include insurance, tracking, excise or bank charges, and it is
          not an offer of credit. Your lender sets the final rate and monthly repayment.
        </p>
      </div>

      <div className="rounded-xl border bg-sand p-6 md:p-8">
        <p className="eyebrow">Estimated monthly payment</p>
        <p className="price-type mt-3 text-[34px] leading-none md:text-[40px]">{formatKes(Math.round(result.monthly))}</p>
        <dl className="mt-6 space-y-3 border-t pt-6 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Amount financed</dt>
            <dd className="font-semibold">{formatKes(Math.round(result.principal))}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Total interest (estimate)</dt>
            <dd className="font-semibold">{formatKes(Math.round(result.interest))}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Total repayable (estimate)</dt>
            <dd className="font-semibold">{formatKes(Math.round(result.total))}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
