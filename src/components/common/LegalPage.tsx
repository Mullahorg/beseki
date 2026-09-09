import { PageHero } from "@/components/common/Section";
import { company } from "@/data/company";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={intro} />
      <div className="container-page py-10 md:py-16">
        <div className="mx-auto max-w-[720px]">
          <p className="rounded-lg border-l-4 border-l-brand-blue bg-muted p-4 text-[14px] leading-relaxed text-muted-foreground">
            This is placeholder wording provided as a starting point. It has not been reviewed by a lawyer and should
            be replaced with policy text prepared for {company.name} before publishing.
          </p>
          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-xl font-bold">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-muted-foreground">
                  {s.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold">Contact us about this policy</h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">
                Questions can be sent to{" "}
                <a href={`mailto:${company.email}`} className="text-brand-blue underline underline-offset-4">
                  {company.email}
                </a>{" "}
                or by phone on{" "}
                <a href={`tel:${company.phoneTel}`} className="text-brand-blue underline underline-offset-4">
                  {company.phoneDisplay}
                </a>
                . Our postal address is {company.address.postal}, {company.address.city}, {company.address.country}.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
