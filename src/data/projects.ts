// ────────────────────────────────────────────────────────────────
//  Your featured projects (shown on the Projects page, in this order).
//
//  This is a curated, hand-edited list — unlike an auto GitHub feed, it
//  works for PRIVATE repos too. Edit freely: reorder, add, remove.
//
//  - visibility "private": no "Code" link is shown (private repos 404 for
//    visitors). Add a `demo` URL if there's something public to link to.
//  - visibility "public": the repo link renders as "Code →".
// ────────────────────────────────────────────────────────────────

export interface Project {
  name: string;
  description?: string;
  /** Primary language — drives the color dot and the distribution bar. */
  language?: string;
  /** Tech/tag chips shown on the card. */
  topics?: string[];
  visibility: "public" | "private";
  /** GitHub URL (only linked when visibility is "public"). */
  repo?: string;
  /** Optional public live-demo / write-up URL. */
  demo?: string;
}

export const projects: Project[] = [
  {
    name: "Project-Olsen",
    description:
      "Paper-only options research, backtesting, and Alpaca paper-trading engine.",
    language: "Python",
    topics: ["python", "options", "backtesting", "alpaca"],
    visibility: "private",
    repo: "https://github.com/Jiang6082/Project-Olsen",
  },
  {
    name: "project-geld",
    description:
      "US-equity research, backtesting, and Alpaca paper-trading engine.",
    language: "Python",
    topics: ["python", "quantitative-finance", "algorithmic-trading", "alpaca", "backtesting"],
    visibility: "public",
    repo: "https://github.com/Jiang6082/project-geld",
  },
  {
    name: "QJS",
    description:
      "Quant & trading internship scanner — automatically tracks quant, trading, research, and engineering internships across a 300+ firm universe, with GitHub as the shared source of truth.",
    language: "JavaScript",
    topics: ["nodejs", "web-scraping", "internships", "quant", "automation"],
    visibility: "private",
    repo: "https://github.com/Jiang6082/QJS",
  },
  {
    name: "summer27-internship-agent",
    description:
      "Summer 2027 software-internship discovery, review, tracking, and application assistant.",
    language: "Python",
    topics: ["python", "automation", "agent"],
    visibility: "private",
    repo: "https://github.com/Jiang6082/summer27-internship-agent",
  },
];

/** Count projects per language for the distribution bar. */
export function languageBreakdown(
  items: Project[]
): { lang: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of items) {
    const l = p.language ?? "Other";
    counts.set(l, (counts.get(l) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([lang, count]) => ({ lang, count }))
    .sort((a, b) => b.count - a.count);
}
