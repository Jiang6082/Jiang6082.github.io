// Combined from the user-provided July engineering and August quantitative resumes.
// Phone number and original PDF files are deliberately excluded from the public site.
export const resume = {
  name: "Bingde (Charles) Jiang",
  summary:
    "Mathematics and Computer Science at the University of Chicago. I build research tools, data pipelines, and web applications, and I’m interested in quantitative trading and research internships.",
  education: {
    school: "The University of Chicago",
    location: "Chicago, IL",
    degree: "B.S. in Mathematics and Computer Science",
    graduation: "Expected June 2028",
    gpa: "3.85 / 4.00",
    abroad:
      "London School of Economics and Political Science — General Course, 2026–2027",
    programs: [
      "AI Development Program",
      "Digital Assets Program",
      "Google Data Analytics Certificate",
      "JPMorgan Quantitative Research Simulation",
      "Akuna Capital Options 101",
    ],
  },
  experience: [
    {
      organization: "UChicago Pediatric Cancer Data Commons",
      role: "Software Engineering Intern",
      dates: "July 2026 – Present",
      location: "Chicago, IL",
      tags: ["Data engineering", "AWS"],
      bullets: [
        "Developing an event-driven AWS Lambda service that processes NLP-annotated clinical-trial data from Amazon S3, queries MySQL, and routes trials to disease-specific Doccano annotation projects.",
        "Designed configurable disease normalization and deterministic project-selection logic for overlapping diagnoses, condition aliases, duplicate S3 events, and idempotent processing.",
      ],
    },
    {
      organization: "IDX Exchange",
      role: "Software Development Intern",
      dates: "January 2026 – May 2026",
      location: "Remote",
      tags: ["Full-stack", "APIs"],
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
      tags: ["Python", "ETL"],
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
      tags: ["Probability", "Combinatorics"],
      bullets: [
        "Applied the probabilistic method to adversarial combinatorial games and authored a 10-page paper on randomized and deterministic winning strategies.",
      ],
    },
    {
      organization: "Murugan Lab",
      role: "Research Assistant",
      dates: "December 2024 – Present",
      location: "Chicago, IL",
      tags: ["Scientific computing", "Python"],
      bullets: [
        "Developed a high-throughput Python pipeline for 100,000–1,000,000 paired-end sequencing reads per experiment, with deterministic mutation classification.",
        "Used vectorized NumPy operations, read clustering, and caching to reduce runtime by approximately 60–70%.",
      ],
    },
  ],
  projects: [
    {
      name: "Systematic Trading Research Platform",
      dates: "May 2026 – Present",
      tools: "Python · NumPy · pandas · SciPy · SQLite · REST and LLM APIs",
      links: [
        { label: "Geld research", href: "/projects/geld" },
        { label: "Emberforge research", href: "/projects/emberforge" },
      ],
      bullets: [
        "Built a modular Alpaca engine for market-data ingestion, point-in-time universe construction, signal generation, next-open backtesting, and paper-trading evaluation across momentum, trend, and mean-reversion strategies.",
        "Implemented reusable, configuration-driven strategy pipelines, REST API integrations, deterministic execution logic, and automated performance reporting.",
        "Paper-deployed a $1.0M core-plus-momentum portfolio. The August résumé reports a 2020–2026 backtest of approximately 16.0% CAGR and 0.86 Sharpe versus 15.4% and 0.82 for SPY after 10 bps slippage. These are historical backtest figures, not paper-account returns.",
        "Developed a companion factor-research system using Deflated Sharpe, BH/Holm multiple-testing corrections, PBO, and White’s Reality Check.",
      ],
    },
    {
      name: "Market Volatility Forecasting",
      dates: "February 2026 – March 2026",
      tools: "Python · pandas · NumPy · scikit-learn · PyTorch · Matplotlib",
      links: [
        { label: "Forecasting walkthrough", href: "/projects/volatility" },
      ],
      bullets: [
        "Built a leakage-controlled pipeline to forecast next-day realized volatility across 14 U.S. equity and sector ETFs using 2015–2025 data, HAR-style volatility lags, returns, volume, and market-regime features.",
        "Benchmarked Ridge, gradient-boosted trees, and a PyTorch MLP with expanding-window walk-forward validation, QLIKE, RMSE, MAE, and regime-level diagnostics.",
      ],
    },
    {
      name: "Property Search Platform",
      dates: "January 2026 – April 2026",
      tools: "React · Node.js · Express · MySQL · Docker · Jest",
      links: [],
      bullets: [
        "Built paginated property browsing, multi-criteria filtering, and results sortable by price, date, size, and bedroom count.",
        "Developed a React frontend with React Router, asynchronous API integration, and automated UI tests using Jest and React Testing Library.",
      ],
    },
    {
      name: "Watered-Down Properties",
      dates: "April 2025",
      tools: "React · TypeScript · Tailwind · Python · Node.js · REST APIs",
      links: [],
      bullets: [
        "Built a full-stack platform correlating USGS water-level data with U.S. housing-price trends through geospatial ZIP-code overlays.",
        "Integrated an AI insights API to generate regional risk summaries.",
      ],
    },
  ],
  leadership: {
    organization: "UChicago Derivatives and Quant Trading Group",
    role: "Analyst",
    dates: "September 2024 – Present",
    location: "Chicago, IL",
    description:
      "Led workshops on probability, machine learning, derivatives, and Black–Scholes; implemented and backtested strategies in the Algorithmic Trading Cohort.",
  },
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
      items: ["AWS Lambda", "Amazon S3", "MySQL", "SQLite", "Docker", "Git"],
    },
  ],
  achievements: [
    "Three-time hackathon winner",
    "USACO Gold",
    "Four-time AIME qualifier",
    "DRW Poker Tournament — second place",
    "QuestBridge / Odyssey Scholar",
  ],
};
