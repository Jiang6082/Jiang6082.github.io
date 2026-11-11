// Web version of my résumé. The phone number is intentionally left off the public site.
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
      tags: ["Risk", "Investments"],
      bullets: [] as string[],
    },
    {
      organization: "UChicago Pediatric Cancer Data Commons",
      role: "Software Engineering Intern",
      dates: "July 2026 – September 2026",
      location: "Chicago, IL",
      tags: ["Data engineering", "AWS"],
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
      organization: "Murugan Lab, University of Chicago",
      role: "Research Assistant",
      dates: "December 2024 – June 2026",
      location: "Chicago, IL",
      tags: ["Scientific computing", "Python", "HPC"],
      bullets: [
        "Built Python/NumPy/SciPy pipelines for 100,000–1,000,000 paired-end sequencing reads per experiment, with Hamming-distance barcode clustering and deterministic mutation classification.",
        "Used vectorization, caching, and algorithmic improvements to reduce runtime by approximately 60–70%; ran the workflows on UChicago’s Midway HPC cluster.",
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
        "Implemented reusable, configuration-driven strategy pipelines, REST API integrations, deterministic execution logic, transaction-cost modeling, and automated performance reporting.",
        "Backtested a 75% SPY core with a 25% momentum sleeve over 2020–July 2026: 15.92% CAGR and 0.85 Sharpe versus 15.30% and 0.82 for SPY after 10 bps slippage. Paper-deployed the portfolio with $1.0M of simulated capital.",
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
      links: [
        {
          label: "Property search walkthrough",
          href: "/projects/idx-exchange",
        },
      ],
      bullets: [
        "Built paginated property browsing, multi-criteria filtering, and results sortable by price, date, size, and bedroom count.",
        "Developed a React frontend with React Router, asynchronous API integration, and automated UI tests using Jest and React Testing Library.",
        "Improved database lookup performance by correcting indexing.",
      ],
    },
    {
      name: "Watered-Down Properties",
      dates: "April 2025",
      tools: "React · TypeScript · Tailwind · Python · Node.js · REST APIs",
      links: [] as { label: string; href: string }[],
      bullets: [
        "Built a full-stack platform correlating USGS water-level data with U.S. housing-price trends through geospatial ZIP-code overlays.",
        "Integrated an AI insights API to generate regional risk summaries.",
      ],
    },
  ],
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
