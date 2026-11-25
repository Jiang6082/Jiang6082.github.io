// Web version of my résumé (also /resume.pdf, built from the same data).
// The phone number is intentionally left off the public site.
import { project } from "./projects";

interface ResumeProject {
  /** Projects on the Projects page this entry covers, by id. */
  ids: string[];
  /** Only needed when the entry isn't exactly one project. */
  name?: string;
  dates?: string;
  tools?: string;
  bullets: string[];
}

export const resume = {
  name: "Bingde (Charles) Jiang",
  updated: "November 2026",
  summary:
    "Mathematics and Computer Science at the University of Chicago, studying abroad at the London School of Economics for 2026–27.",
  education: [
    {
      school: "The University of Chicago",
      location: "Chicago, IL",
      degree: "B.S. in Mathematics and Computer Science",
      dates: "Expected June 2028",
      gpa: "3.59 / 4.00",
      courseworkLabel: "Relevant coursework",
      coursework: [
        "Systems Programming I (CMSC 14300)",
        "Introduction to Computer Science II (CMSC 14200)",
        "Discrete Mathematics (CMSC 27100)",
        "Abstract Linear Algebra (MATH 20250)",
        "Accelerated Analysis in Rⁿ I–III (MATH 20310–20510)",
        "Introduction to Mathematical Probability (STAT 25100)",
        "Quantitative Portfolio Management and Algorithmic Trading (FINM 25000)",
        "Financial Accounting (BUSN 20100)",
      ],
    },
    {
      school: "London School of Economics and Political Science",
      location: "London, UK",
      degree: "General Course, year-long undergraduate study abroad",
      dates: "2026–2027",
      courseworkLabel: "Coursework in progress",
      coursework: [
        "Machine Learning (ST310)",
        "Operations Research Techniques (MA213)",
        "Quantitative Methods / Statistics (ST107)",
        "Stochastic and Actuarial Methods in Finance (ST330)",
        "Algebra and Number Theory (MA211)",
      ],
    },
  ],
  programs: [
    "AI Development Program",
    "Digital Assets Program",
    "Google Data Analytics Certificate",
    "JPMorgan Quantitative Research Simulation",
    "Akuna Capital Options 101",
  ],
  experience: [
    {
      organization: "Invesco",
      role: "Incoming Investments (Risk) Intern",
      dates: "June 2027 – July 2027",
      location: "New York, NY",
      bullets: [] as string[],
    },
    {
      organization: "UChicago Pediatric Cancer Data Commons",
      role: "Software Engineering Intern",
      dates: "July 2026 – September 2026",
      location: "Chicago, IL",
      bullets: [
        "Built an event-driven AWS Lambda service that processes NLP-annotated clinical-trial data from Amazon S3, queries MySQL, and routes trials to disease-specific Doccano annotation projects.",
        "Designed configurable disease normalization and deterministic project-selection logic for overlapping diagnoses, condition aliases, duplicate S3 events, and idempotent processing.",
      ],
    },
    {
      organization: "IDX Exchange",
      role: "Software Development Intern",
      dates: "January 2026 – May 2026",
      location: "Remote",
      bullets: [
        "Engineered full-stack features for a real-estate data platform, with property search, filtering, and optimized pagination.",
        "Designed and integrated RESTful APIs connecting frontend interfaces to database-backed services.",
      ],
    },
    {
      organization: "Nuvora",
      role: "Software Development Intern",
      dates: "September 2025 – March 2026",
      location: "Chicago, IL",
      bullets: [
        "Built modular Python ETL pipelines for product and market data, processing more than 10,000 records per run.",
        "Optimized transformations and I/O to reduce pipeline runtime by approximately 45%.",
      ],
    },
    {
      organization: "University of Chicago Mathematics REU",
      role: "Researcher",
      dates: "June 2025 – July 2025",
      location: "Chicago, IL",
      bullets: [
        "Applied the probabilistic method to adversarial combinatorial games and authored a 10-page paper on randomized and deterministic winning strategies.",
      ],
    },
    {
      organization: "Murugan Lab, University of Chicago",
      role: "Research Assistant",
      dates: "December 2024 – June 2026",
      location: "Chicago, IL",
      bullets: [
        "Built Python/NumPy/SciPy pipelines for 100,000–1,000,000 paired-end sequencing reads per experiment, with Hamming-distance barcode clustering and deterministic mutation classification.",
        "Used vectorization, caching, and algorithmic improvements to reduce runtime by approximately 60–70%; ran the workflows on UChicago’s Midway HPC cluster.",
      ],
    },
  ],
  // Projects that are on the Projects page take their title, dates, tools,
  // and walkthrough link from src/data/projects.ts (by id). Bullets lead
  // with the outcome.
  projects: [
    {
      name: "Systematic Trading Research Platform",
      ids: ["project-geld", "project-emberforge"],
      dates: "May 2026 – Present",
      tools: "Python · NumPy · pandas · SciPy · SQLite · REST and LLM APIs",
      bullets: [
        "Backtested a 75% SPY core with a 25% momentum sleeve over 2020–July 2026: 15.92% CAGR and 0.85 Sharpe versus 15.30% and 0.82 for SPY after 10 bps slippage. Paper-deployed the portfolio with $1.0M of simulated capital.",
        "Built a modular Alpaca engine for market-data ingestion, point-in-time universe construction, signal generation, next-open backtesting, and paper-trading evaluation across momentum, trend, and mean-reversion strategies.",
        "Implemented reusable, configuration-driven strategy pipelines, REST API integrations, deterministic execution logic, transaction-cost modeling, and automated performance reporting.",
        "Developed a companion factor-research system using Deflated Sharpe, BH/Holm multiple-testing corrections, PBO, and White’s Reality Check.",
      ],
    },
    {
      ids: ["poker"],
      bullets: [
        "Built an empirical-Bayes model that shrinks each player’s action frequencies toward the population; on 11,298 later decisions it cut log loss from 0.659 to 0.577 (95% interval for the change: −0.087 to −0.076).",
        "Audited 21.6 million online hand histories across 37 checksum-verified shards with DuckDB, flagging duplicates, conflicting hand IDs, and errors in the published dataset card.",
        "Replayed 51,854 hands action by action with PokerKit, using exact decimal chip accounting with zero failures, to build 447,356 leakage-free decision snapshots.",
      ],
    },
    {
      ids: ["treasury-yield-curve-research"],
      bullets: [
        "Forecast five-day 10-year yield changes with monthly-refit Ridge models, purging overlapping labels at every refit; on 993 held-out forecasts the model did not beat a no-change baseline (14.24 vs. 14.20 bp RMSE).",
        "Built a reproducible pipeline on 4,001 daily Treasury curves (2010–2025) from hash-verified official sources, cross-checked against all 16,004 matching FRED values.",
        "Measured bond risk for a $1M 10-year position (DV01 $817.57/bp) and showed duration plus convexity matches exact repricing within $0.13 for a 10 bp shock.",
      ],
    },
    {
      ids: ["market-volatility-forecasting"],
      bullets: [
        "Built a leakage-controlled pipeline to forecast next-day realized volatility across 14 U.S. equity and sector ETFs using 2015–2025 data, HAR-style volatility lags, returns, volume, and market-regime features.",
        "Benchmarked Ridge, gradient-boosted trees, and a PyTorch MLP with expanding-window walk-forward validation, QLIKE, RMSE, MAE, and regime-level diagnostics.",
      ],
    },
    {
      ids: ["idx-exchange"],
      bullets: [
        "Built paginated property browsing, multi-criteria filtering, and results sortable by price, date, size, and bedroom count.",
        "Developed a React frontend with React Router, asynchronous API integration, and automated UI tests using Jest and React Testing Library.",
        "Improved database lookup performance by correcting indexing.",
      ],
    },
    {
      name: "Watered-Down Properties",
      ids: [] as string[],
      dates: "April 2025",
      tools: "React · TypeScript · Tailwind · Python · Node.js · REST APIs",
      bullets: [
        "Built a full-stack platform correlating USGS water-level data with U.S. housing-price trends through geospatial ZIP-code overlays.",
        "Integrated an AI insights API to generate regional risk summaries.",
      ],
    },
  ] as ResumeProject[],
  skills: [
    {
      group: "Languages",
      items: [
        "Python",
        "C/C++",
        "Java",
        "SQL",
        "C#",
        "JavaScript",
        "TypeScript",
      ],
    },
    {
      group: "Research & data",
      items: [
        "NumPy",
        "pandas",
        "SciPy",
        "statsmodels",
        "scikit-learn",
        "PyTorch",
        "Matplotlib",
        "Biopython",
      ],
    },
    {
      group: "Web & testing",
      items: [
        "React",
        "React Router",
        "Node.js",
        "Express",
        "Tailwind",
        "REST APIs",
        "Jest",
        "React Testing Library",
      ],
    },
    {
      group: "Infrastructure & storage",
      items: [
        "AWS Lambda",
        "Amazon S3",
        "MySQL",
        "SQLite",
        "Docker",
        "Git",
        "Linux/Unix",
        "HPC (Midway)",
      ],
    },
  ],
};

/** Résumé projects with title, dates, tools, and walkthrough links filled in
 *  from the project records. */
export const resumeProjects = resume.projects.map((entry) => {
  const records = entry.ids.map(project);
  const one = records.length === 1 ? records[0] : undefined;
  return {
    name: entry.name ?? one!.title,
    dates: entry.dates ?? one!.dates,
    tools: entry.tools ?? one!.tools,
    bullets: entry.bullets,
    links: records
      .filter((r) => r.slug)
      .map((r) => ({
        label: records.length > 1 ? `${r.title} walkthrough` : "Walkthrough",
        href: `/projects/${r.slug}`,
      })),
  };
});
