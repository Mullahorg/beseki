/** Typography themes an administrator can pick in Site settings. */
export const FONT_THEMES = [
  {
    value: "signature",
    label: "BESEKI Signature",
    description: "Sora headings with Manrope body — the current house style.",
    preview: "Sora / Manrope",
  },
  {
    value: "modern",
    label: "Modern Tech",
    description: "Space Grotesk headings with Plus Jakarta Sans body.",
    preview: "Space Grotesk / Plus Jakarta Sans",
  },
  {
    value: "editorial",
    label: "Editorial",
    description: "Instrument Serif headings with Work Sans body.",
    preview: "Instrument Serif / Work Sans",
  },
  {
    value: "classic",
    label: "Classic Dealer",
    description: "Libre Baskerville headings with Source Sans body.",
    preview: "Libre Baskerville / Source Sans 3",
  },
  {
    value: "bold",
    label: "Bold Showroom",
    description: "Bebas Neue headings with Barlow body.",
    preview: "Bebas Neue / Barlow",
  },
  {
    value: "neutral",
    label: "Clean Neutral",
    description: "Outfit headings with Figtree body.",
    preview: "Outfit / Figtree",
  },
] as const;

export type FontThemeValue = (typeof FONT_THEMES)[number]["value"];

export function fontThemeClass(value: string | null | undefined) {
  const known = FONT_THEMES.some((f) => f.value === value);
  return `font-theme-${known ? value : "signature"}`;
}
