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
      "Research, backtesting, and Alpaca paper-trading engine for US equities. A strategy is only promoted if it keeps out-of-sample alpha after realistic costs — enforced with Benjamini-Hochberg FDR control, alpha/beta gates, and a locked forward-shadow protocol. Runs a dual-account paper workflow (daily + 15-minute intraday). Paper-only by design.",
    language: "Python",
    topics: ["python", "quantitative-finance", "algorithmic-trading", "alpaca", "backtesting"],
    visibility: "public",
    repo: "https://github.com/Jiang6082/project-geld",
  },
  {
    name: "project-emberforge",
    description:
      "AI-assisted platform for discovering quantitative trading factors — built to stop you fooling yourself. It records every trial and prices in how many you ran (Deflated Sharpe, FDR), statically and dynamically hunts look-ahead leakage, flags rediscovered duplicates, and refuses to call anything “alpha.” A research system, not a trading bot — no brokerage code, no orders.",
    language: "Python",
    topics: ["python", "quant-research", "factor-discovery", "statistics"],
    visibility: "public",
    repo: "https://github.com/Jiang6082/project-emberforge",
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
