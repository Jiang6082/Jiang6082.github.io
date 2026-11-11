// Every project on the site, in display order. The homepage, the Projects
// page, and the walkthrough links all read from this list.
//
// `id` is the GitHub repository name. It doubles as the anchor on /projects
// and as the key for the demos in ProjectVisual and ProjectPlayground.
// Private repositories never get a public code link.

export interface Project {
  id: string;
  title: string;
  /** Walkthrough page under /projects/<slug>, if one exists. */
  slug?: string;
  /** Short category label on the homepage. */
  kind: string;
  /** One-line description on the homepage. */
  summary: string;
  /** What the project is for, shown on the Projects page. */
  purpose: string;
  /** Headline result. */
  result: string;
  /** The one caveat that belongs next to the result. */
  context: string;
  /** Show on the homepage. */
  featured: boolean;
  language: string;
  topics: string[];
  visibility: "public" | "private";
  repo?: string;
  /** Optional public demo or write-up URL. */
  demo?: string;
}

export const projects: Project[] = [
  {
    id: "project-emberforge",
    title: "Emberforge",
    slug: "emberforge",
    kind: "Quantitative research",
    summary: "Testing factors while keeping track of every failed experiment.",
    purpose:
      "Find trading factors and test whether they survive statistical checks.",
    result: "24 candidates → 1 survivor",
    context: "Documented synthetic demo; not evidence of a live trading edge.",
    featured: true,
    language: "Python",
    topics: ["python", "quant-research", "factor-discovery", "statistics"],
    visibility: "public",
    repo: "https://github.com/Jiang6082/project-emberforge",
  },
  {
    id: "project-geld",
    title: "Geld",
    slug: "geld",
    kind: "Trading systems",
    summary:
      "Point-in-time backtests, portfolio construction, and paper execution.",
    purpose:
      "Backtest equity strategies, account for trading costs, and run them in paper trading.",
    result: "15.92% annualized return vs. 15.30% for SPY",
    context:
      "V4 diagnostic, 2020–July 2026, at 10 bps slippage. Previously inspected history, not a fresh holdout.",
    featured: true,
    language: "Python",
    topics: [
      "python",
      "quantitative-finance",
      "algorithmic-trading",
      "alpaca",
      "backtesting",
    ],
    visibility: "public",
    repo: "https://github.com/Jiang6082/project-geld",
  },
  {
    id: "market-volatility-forecasting",
    title: "Forecasting volatility",
    slug: "volatility",
    kind: "Machine learning",
    summary: "Comparing next-day variance forecasts across 14 U.S. ETFs.",
    purpose:
      "Forecast next-day volatility across 14 ETFs with walk-forward evaluation.",
    result: "39.7% lower QLIKE loss than persistence",
    context: "Recorded 2020–2025 ensemble forecasts; lower loss is better.",
    featured: true,
    language: "Python",
    topics: ["python", "machine-learning", "volatility", "time-series"],
    visibility: "public",
    repo: "https://github.com/Jiang6082/market-volatility-forecasting",
  },
  {
    id: "Project-Olsen",
    title: "Olsen",
    kind: "Options research",
    summary: "Paper-only options research, backtesting, and paper trading.",
    purpose: "Research and backtest options strategies before paper trading.",
    result: "Explore an option’s payoff and price surface",
    context:
      "Illustrative options models; no strategy performance is published.",
    featured: false,
    language: "Python",
    topics: ["python", "options", "backtesting", "alpaca"],
    visibility: "private",
  },
  {
    id: "idx-exchange",
    title: "Property Search Platform",
    slug: "idx-exchange",
    kind: "Full-stack engineering",
    summary: "Property search, map filters, and a database-backed API.",
    purpose:
      "Search properties on a map, narrow the results, and compare listings.",
    result: "Map filters → paginated listings → property comparison",
    context:
      "Implemented with React, Express, and MySQL. Demo listings are fictional.",
    featured: true,
    language: "JavaScript",
    topics: ["react", "nodejs", "express", "mysql", "leaflet"],
    visibility: "public",
    repo: "https://github.com/Jiang6082/idx-exchange",
  },
];
