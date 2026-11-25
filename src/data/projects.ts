// Every project on the site, in display order. This is the one record for
// each project: the homepage, the Projects page, the walkthrough pages, and
// the résumé all read titles, dates, and tools from here.
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
  /** When it was built, as on the résumé, e.g. "May 2026 – Present". */
  dates: string;
  /** Main tools by name, e.g. "Python · DuckDB · Polars". */
  tools: string;
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
    dates: "May 2026 – Present",
    tools: "Python · NumPy · pandas · SciPy · statsmodels · LLM API",
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
    dates: "May 2026 – Present",
    tools: "Python · NumPy · pandas · SQLite · Alpaca REST API",
    visibility: "public",
    repo: "https://github.com/Jiang6082/project-geld",
  },
  {
    id: "market-volatility-forecasting",
    title: "Market Volatility Forecasting",
    slug: "volatility",
    kind: "Machine learning",
    summary: "Comparing next-day variance forecasts across 14 U.S. ETFs.",
    purpose:
      "Forecast next-day volatility across 14 ETFs with walk-forward evaluation.",
    result: "39.7% lower QLIKE loss than persistence",
    context: "Recorded 2020–2025 ensemble forecasts; lower loss is better.",
    featured: false,
    dates: "February 2026 – March 2026",
    tools: "Python · pandas · NumPy · scikit-learn · PyTorch · Matplotlib",
    visibility: "public",
    repo: "https://github.com/Jiang6082/market-volatility-forecasting",
  },
  {
    id: "treasury-yield-curve-research",
    title: "Treasury Yield-Curve Research",
    slug: "treasury-yields",
    kind: "Fixed-income research",
    summary: "Testing whether the yield curve forecasts next-week Treasury moves.",
    purpose:
      "Test whether yield-curve shape forecasts next-week moves in the 10-year Treasury yield.",
    result: "No edge over predicting no change: 14.24 vs. 14.20 bp RMSE",
    context:
      "993 held-out 2022–2025 forecasts. Par-yield changes aren’t tradable returns.",
    featured: false,
    dates: "November 2026",
    tools: "Python · pandas · NumPy · SciPy · scikit-learn · Matplotlib",
    visibility: "private",
  },
  {
    id: "poker",
    title: "Poker Opponent Modeling",
    slug: "poker",
    kind: "Bayesian modeling",
    summary: "Personal opponent models from 21.6 million audited poker hands.",
    purpose:
      "Measure how much a player’s own history improves action prediction over population behavior.",
    result: "Log loss 0.577 vs. 0.659 for the population model",
    context:
      "11,298 held-out decisions from two PokerStars players; assumes anonymized player IDs persist.",
    featured: true,
    dates: "November 2026",
    tools: "Python · DuckDB · Polars · PokerKit · NumPy · SciPy · scikit-learn",
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
    dates: "January 2026 – April 2026",
    tools: "React · Node.js · Express · MySQL · Docker · Jest",
    visibility: "public",
    repo: "https://github.com/Jiang6082/idx-exchange",
  },
];

/** Look up a project by id (throws if it doesn't exist, so typos fail the build). */
export function project(id: string): Project {
  const p = projects.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown project: ${id}`);
  return p;
}
