export const walkthroughs = [
  {
    slug: "emberforge",
    project: "project-emberforge",
    title: "Emberforge",
    intro:
      "A place to test trading ideas without losing track of the failures.",
    problem:
      "Try enough formulas and some will look good by chance. Keeping only the winners hides how many attempts it took to find them.",
    built:
      "A factor research pipeline with a small formula language, a registry of every attempt, and statistical checks before an idea can move forward.",
    steps: [
      [
        "Define an idea",
        "A typed formula describes a factor, such as a 20-day return. The same expression can be parsed, checked, and evaluated consistently.",
      ],
      [
        "Try to break it",
        "Causality checks look for future information. Duplicate checks compare formulas, correlations, and economic families. Failed attempts stay in the registry.",
      ],
      [
        "Keep the handoff explicit",
        "Surviving research is exported with checksums for a separate backtesting engine. Passing these checks is a reason to investigate, not proof of an edge.",
      ],
    ],
    detail:
      "The interesting part is counting failures as data. Multiple-testing adjustments are only useful when the research history includes the attempts that did not work.",
    artifact: "ts_returns(close, 20)",
    artifactLabel: "Example factor expression from the repository",
    source: "https://github.com/Jiang6082/project-emberforge",
    result:
      "The repository includes a deterministic synthetic demo and a research report generator. This walkthrough describes the system; it does not claim live trading results.",
  },
  {
    slug: "geld",
    project: "project-geld",
    title: "Geld",
    intro: "Turning research signals into backtests and paper orders.",
    problem:
      "A useful signal and a realistic trade are different things. A backtest can look better than it should if it fills an order before the signal was available, ignores costs, or counts an order twice.",
    built:
      "A US equities engine that separates target portfolio weights from execution. The same strategy interface feeds a backtest or a paper-trading planner.",
    steps: [
      [
        "Produce target weights",
        "A strategy returns a timestamp, symbol, target weight, and score. It does not send orders directly.",
      ],
      [
        "Simulate the next opportunity",
        "Backtests use next-session open fills, with fees and slippage. Exposure limits constrain the resulting portfolio.",
      ],
      [
        "Reconcile before ordering",
        "The paper planner accounts for positions and open orders. Deterministic client IDs help identify repeated requests.",
      ],
    ],
    detail:
      "The boundary between a desired portfolio and an order keeps research logic independent of execution details. It also makes timing assumptions easier to inspect.",
    artifact: "timestamp  ·  symbol  ·  target_weight  ·  score",
    artifactLabel: "Strategy output contract",
    source: "https://github.com/Jiang6082/project-geld",
    result:
      "The engine supports offline synthetic backtests and paper trading. Its scope is research and simulation; there is no live-trading mode.",
  },
  {
    slug: "volatility",
    project: "market-volatility-forecasting",
    title: "Forecasting volatility",
    intro: "Can a model improve on tomorrow looking like today?",
    problem:
      "Time-series models can accidentally learn from the future. A good-looking score is not useful if preprocessing or evaluation gives a model information it would not have had at prediction time.",
    built:
      "A next-day volatility forecasting pipeline for 14 US ETFs, with causal features and repeated walk-forward evaluation.",
    steps: [
      [
        "Make the timing explicit",
        "Features are available at the close of day t. The target is the following day’s Garman–Klass variance.",
      ],
      [
        "Move forward through time",
        "The training window expands; validation and test periods stay later in time. Transformations are fit on training data only.",
      ],
      [
        "Compare against simple baselines",
        "Persistence and rolling averages sit alongside econometric and machine-learning models. QLIKE measures forecast loss; lower is better.",
      ],
    ],
    detail:
      "The evaluation design matters as much as the model. Keeping the train, validation, and test boundaries consistent makes the comparison more meaningful.",
    image: "/projects/volatility-prediction.png",
    imageAlt:
      "Scatter plot of ensemble predicted variance against realized variance, with a diagonal reference line",
    artifactLabel: "Actual output chart from the project repository",
    source: "https://github.com/Jiang6082/market-volatility-forecasting",
    result:
      "The committed results report ensemble QLIKE of 0.2857 versus 0.4735 for persistence across 21,098 ETF-days. These are recorded forecast results, not a new run or trading returns.",
    evidence:
      "https://github.com/Jiang6082/market-volatility-forecasting/blob/62832a8b9daea050859d37bd5065810deb165910/reports/tables/metrics_overall.csv",
  },
  {
    slug: "qjs",
    project: "QJS",
    title: "QJS",
    intro: "Keeping track of internship openings across hundreds of firms.",
    problem:
      "Internship listings live across many different career sites. Rechecking them by hand makes it easy to miss a new role or rediscover the same one.",
    built:
      "A scanner that gathers quant, trading, research, and engineering internships across a 300+ firm universe and produces shared reports in GitHub.",
    steps: [
      [
        "Read different career systems",
        "Source-specific adapters turn varied job listings into a common set of fields.",
      ],
      [
        "Identify the role",
        "Stable role identities and URLs help distinguish a new listing from another appearance of an existing one.",
      ],
      [
        "Compare and report",
        "A saved baseline lets the next scan identify changes. Markdown and CSV reports make the results easy to browse and reuse.",
      ],
    ],
    detail:
      "The useful unit is a role, not a page of search results. Maintaining identity across scans is what turns a list of links into a tracker.",
    artifact: "Career sources → normalized roles → saved baseline → reports",
    artifactLabel: "Documented scan flow",
    source: "https://github.com/Jiang6082/QJS",
    result:
      "The repository contains the scanner, saved scan data, and generated reports. Coverage and open-role counts change with each run; the linked repository carries the current reports.",
  },
];
