export interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  table?: { caption: string; columns: string[]; rows: string[][] };
  code?: string;
  image?: { src: string; alt: string; caption: string };
  sources: { label: string; url: string }[];
}
export interface Walkthrough {
  slug: string;
  project: string;
  title: string;
  intro: string;
  scope: string;
  facts: { value: string; label: string }[];
  sections: Section[];
  source: string;
}
const source = (repo: string, ref: string, path: string, label: string) => ({
  label,
  url: `https://github.com/Jiang6082/${repo}/blob/${ref}/${path}`,
});
const ember = (path: string, label: string) =>
  source(
    "project-emberforge",
    "f5bfeb4eb6deb8ad1a9de071ceba9f77724684b7",
    path,
    label,
  );
const geld = (path: string, label: string) =>
  source(
    "project-geld",
    "bece5c41449256bfc94a34d8badbf014cffe29bd",
    path,
    label,
  );
const vol = (path: string, label: string) =>
  source(
    "market-volatility-forecasting",
    "62832a8b9daea050859d37bd5065810deb165910",
    path,
    label,
  );
const idx = (path: string, label: string) =>
  source(
    "idx-exchange",
    "224170cd9e175e29da99d0dd97bcb794e5adbabe",
    path,
    label,
  );

export const walkthroughs: Walkthrough[] = [
  {
    slug: "emberforge",
    project: "project-emberforge",
    title: "Emberforge",
    intro:
      "Factor research with causal computation, a persistent experiment registry, and explicit tests for selection bias.",
    scope:
      "Recorded synthetic demonstration. Methods checked against the linked source revision; demo metrics come from the implementation report.",
    facts: [
      { value: "24", label: "Candidates in the documented demo" },
      { value: "0.073", label: "Survivor mean IC" },
      { value: "2.53", label: "Diagnostic long–short Sharpe" },
    ],
    source: "https://github.com/Jiang6082/project-emberforge",
    sections: [
      {
        id: "design",
        title: "From a formula to an experiment",
        paragraphs: [
          "A factor starts as a declarative expression rather than executable Python. The parser produces a typed specification with a canonical expression hash. Static checks reject non-causal lookbacks; a second check perturbs future prices and confirms that earlier factor values do not change.",
          "The family pipeline computes scores, evaluates them against forward returns, and writes each attempt to SQLite before the family statistics run. Invalid expressions and duplicates remain in the research history. Dataset fingerprints, seeds, expression hashes, and lineage make the result traceable.",
        ],
        code: "ts_returns(close, 20)\nneg(ts_std(ts_returns(close, 1), 25))\ncs_rank(divide(volume, ts_mean(volume, 20)))",
        sources: [
          ember("src/emberforge/research/pipeline.py", "Family pipeline"),
          ember("README.md", "Factor language examples"),
        ],
      },
      {
        id: "evaluation",
        title: "What the factor statistics measure",
        paragraphs: [
          "Cross-sectional information coefficient (IC) measures whether higher factor scores line up with higher subsequent returns. The diagnostic portfolio sorts stocks into five buckets and subtracts the bottom bucket’s mean forward return from the top bucket’s. Its Sharpe annualizes the mean-to-standard-deviation ratio by √252.",
          "Turnover here is the fraction of top-quintile names replaced between periods, averaged through time. It is not the annual traded-notional measure used in Geld. Net diagnostic Sharpe subtracts an estimated per-period cost; the separately reported gross Sharpe should not be mistaken for executable performance.",
        ],
        code: "long–short return = mean(top quintile) − mean(bottom quintile)\nannualized Sharpe = √252 × mean(return) / std(return)",
        sources: [
          ember(
            "src/emberforge/analytics/portfolio.py",
            "Quantiles, turnover, and Sharpe",
          ),
        ],
      },
      {
        id: "selection",
        title: "Selection and duplicate controls",
        paragraphs: [
          "The current pipeline applies Benjamini–Hochberg and Holm corrections to the evaluated candidates’ IC p-values. Deflated Sharpe uses the full registry family trial count, including failed attempts, to penalize searching many hypotheses. The current code does not pass failed candidates into the BH p-value array.",
          "Promotion checks |mean IC| ≥ 0.01, |IC t-statistic| ≥ 2, turnover ≤ 0.9, rejection under the family BH test, Deflated Sharpe ≥ 0.60 when available, and acceptable novelty. Candidates are ranked by absolute mean IC before correlation-based deduplication, so weaker copies are compared with stronger candidates.",
          "CSCV and combinatorial-purged PBO, White’s Reality Check, Hansen’s SPA, and bootstrap Sharpe intervals are also calculated. They are reported diagnostics; the current decision function does not use all of them as promotion gates.",
        ],
        sources: [
          ember(
            "src/emberforge/research/pipeline.py",
            "Implemented statistical flow",
          ),
          ember(
            "src/emberforge/research/decision.py",
            "Actual promotion rules",
          ),
        ],
      },
      {
        id: "results",
        title: "Recorded demo results",
        paragraphs: [
          "The deterministic demo uses seed 7 and plants a 20-bar momentum effect in synthetic data. Its candidate set combines that factor with related formulas and weak signals. The repository documents 24 attempts and a single exported survivor, momentum_20.",
        ],
        table: {
          caption: "momentum_20 — reported synthetic demonstration",
          columns: ["Measure", "Recorded value"],
          rows: [
            ["Evaluated periods", "379"],
            ["Mean IC", "0.073"],
            ["IC t-statistic", "4.68"],
            ["Gross diagnostic long–short Sharpe", "2.53"],
            ["Top-quintile replacement turnover", "0.17"],
            ["BH-adjusted p-value", "0.0001"],
            ["Decision", "research_survivor"],
          ],
        },
        sources: [
          ember("docs/IMPLEMENTATION_REPORT.md", "Recorded metric table"),
          ember("src/emberforge/demo.py", "Seed and candidate construction"),
          ember("README.md", "24-candidate demo summary"),
        ],
      },
      {
        id: "what-didnt-work",
        title: "What didn’t work: another formula, the same signal",
        paragraphs: [
          "The synthetic demo includes momentum_20_dup, a different expression that the implementation report identifies as a duplicate of momentum_20. Adding it to the candidate set did not supply an independent research idea.",
          "The pipeline keeps the attempt in the registry and checks both expression identity and correlation between factor scores. In the linked implementation, stronger candidates are considered first so a weaker copy does not displace them. The documented 24-attempt demo exports one survivor.",
          "The lesson is to count independent signals rather than formulas. This result tests duplicate handling on synthetic data; it does not show that the surviving factor will work in a market.",
        ],
        sources: [
          ember("docs/IMPLEMENTATION_REPORT.md", "Documented duplicate factor"),
          ember(
            "src/emberforge/research/pipeline.py",
            "Candidate ordering and duplicate checks",
          ),
        ],
      },
      {
        id: "interpretation",
        title: "What this demonstrates",
        paragraphs: [
          "This is a controlled recovery test: the system finds an effect deliberately inserted into the data while keeping failed attempts visible. The Sharpe is evidence that the demo behaves as intended, not evidence of a discovered market strategy.",
          "A separate walk-forward evaluator reserves an initial warm-up and measures a fixed factor in sequential windows. It reports mean IC, worst-window IC, and sign consistency; it does not refit or reselect factor parameters inside each fold. A wider search would need its own unseen evaluation.",
          "The exported bundle contains a declarative factor, provenance, statistics, and checksums. It crosses into Geld through a reviewed offline handoff; Emberforge itself has no order-execution path.",
        ],
        sources: [
          ember(
            "src/emberforge/research/walkforward.py",
            "Sequential evaluation",
          ),
          ember("src/emberforge/demo.py", "Bundle construction"),
        ],
      },
    ],
  },
  {
    slug: "geld",
    project: "project-geld",
    title: "Geld",
    intro:
      "Equity and intraday research built around point-in-time universes, execution costs, and reproducible strategy comparisons.",
    scope:
      "Recorded historical research. Daily V4, intraday V13, and V15 use different exposures, feeds, and costs; their returns are not directly comparable.",
    facts: [
      { value: "1,092", label: "Historically eligible stocks in V4" },
      { value: "15.92%", label: "Daily V4 diagnostic CAGR" },
      { value: "0.963", label: "Intraday V13 matched SIP Sharpe" },
    ],
    source: "https://github.com/Jiang6082/project-geld",
    sections: [
      {
        id: "daily-method",
        title: "Daily V4: separate market exposure from stock selection",
        paragraphs: [
          "V3 combined stock selection with the decision to stay invested and missed parts of several market advances. V4 separates those decisions: a persistent 75% SPY core supplies market exposure, while a 25% active sleeve selects residual-momentum stocks with trend confirmation, downside-volatility controls, and correlation-aware diversification.",
          "The daily study uses a monthly point-in-time top-500 liquid universe drawn from 1,092 historically eligible stocks, with adjusted SIP bars from January 2016 through July 2026. Targets are formed at the close and filled at the next session’s open. The selected configuration holds up to 40 active stocks, caps each at 2%, rebalances every 21 sessions, and uses a 0.25-percentage-point no-trade band.",
          "Selection used 2017–2019. The 2020–July 2026 comparison is a later diagnostic, but previous V2/V3 work had already inspected that history. It is not a fresh holdout.",
        ],
        sources: [
          geld(
            "docs/research/MOMENTUM_V4_RESEARCH.md",
            "V4 design and evaluation protocol",
          ),
        ],
      },
      {
        id: "daily-results",
        title: "Daily results and cost sensitivity",
        paragraphs: [
          "At 10 bps slippage, the selected 75/25 portfolio improves recorded CAGR by 0.62 percentage points over SPY and Sharpe by 0.038. A beta of 0.969 and nearly unchanged crash drawdown show how much of the result still comes from market exposure.",
          "The same V4 portfolio falls to 15.61% CAGR at 25 bps and 15.10% at 50 bps. By the 50-bps case, its CAGR advantage over the recorded SPY baseline is gone. Low turnover is therefore part of the strategy’s economics.",
        ],
        table: {
          caption:
            "V4 later-period diagnostic, 2020–July 2026; 10 bps slippage",
          columns: [
            "Portfolio",
            "CAGR",
            "Sharpe",
            "Max drawdown",
            "Annual turnover",
          ],
          rows: [
            ["V4 75/25", "15.92%", "0.854", "−33.70%", "1.71×"],
            ["V4 60/40", "15.91%", "0.852", "−33.37%", "2.81×"],
            ["V4 60/40 multifactor", "15.18%", "0.832", "−32.77%", "2.67×"],
            ["SPY buy-and-hold", "15.30%", "0.816", "−33.79%", "0.00×"],
          ],
        },
        sources: [
          geld(
            "docs/research/MOMENTUM_V4_RESEARCH.md",
            "V4 comparison and slippage stress",
          ),
          geld(
            "src/project_geld/metrics.py",
            "CAGR, Sharpe, beta, and turnover definitions",
          ),
        ],
      },
      {
        id: "daily-v41",
        title: "V4.1: benchmark-aware weighting and a defensive variant",
        paragraphs: [
          "V4.1 adds filing-dated SEC fundamentals, quality and earnings scores, and benchmark-aware portfolio weights. The recorded real-data quality/earnings ablation is still pending; the completed comparison below is price-only. It uses the same point-in-time universe, 10-bps slippage, next-open execution, and 21-session rebalancing.",
          "Benchmark-aware weighting improves the already-inspected later period but slightly underperforms the price control during 2017–2019 training. The defensive version keeps 15% cash and trades lower CAGR for shallower drawdown. Neither finding turns the reused 2020–2026 sample into independent evidence.",
        ],
        table: {
          caption:
            "Separate V4.1 price-only diagnostic; its V4 control is from this run",
          columns: [
            "Variant",
            "CAGR",
            "Sharpe",
            "Max drawdown",
            "Annual turnover",
          ],
          rows: [
            ["V4 price control", "15.99%", "0.857", "−33.70%", "1.71×"],
            ["Benchmark-aware price", "16.46%", "0.873", "−33.55%", "1.69×"],
            ["Defensive, 15% cash", "14.20%", "0.879", "−28.95%", "1.71×"],
          ],
        },
        sources: [
          geld(
            "docs/research/MOMENTUM_V41_PROGRESS.md",
            "V4.1 completed results and pending ablation",
          ),
        ],
      },
      {
        id: "intraday-method",
        title: "Intraday V13: test the risk filters separately",
        paragraphs: [
          "V13 keeps V12’s entry logic and point-in-time liquid-100 universe, then adds a 20-session annualized volatility ceiling of 150%, minimum market breadth of 45% above intraday VWAP, and a 60-session pairwise correlation ceiling of 0.85. Volatility and correlation use information through the prior session; breadth is measured at the confirmation bar.",
          "The matched SIP comparison runs from July 27, 2020 to July 17, 2026 with $100,000 initial cash and 8 bps one-way slippage. Component ablations show that the combined filter improves the risk-adjusted result more than any component on its own.",
        ],
        table: {
          caption:
            "Matched SIP intraday research; returns are total-period returns",
          columns: [
            "Variant",
            "Total return",
            "Sharpe",
            "Max drawdown",
            "Positions",
          ],
          rows: [
            ["V12 control", "5.79%", "0.737", "−1.84%", "65"],
            ["Volatility only", "4.23%", "0.749", "−1.58%", "45"],
            ["Breadth only", "5.18%", "0.719", "−1.60%", "44"],
            ["Correlation only", "4.95%", "0.722", "−1.51%", "60"],
            ["Final V13", "5.91%", "0.963", "−1.03%", "45"],
          ],
        },
        sources: [
          geld(
            "research-results/intraday-v13-summary.json",
            "Machine-readable V13 results",
          ),
          geld(
            "docs/research/INTRADAY_V13_RESEARCH.md",
            "Protocol and ablation interpretation",
          ),
        ],
      },
      {
        id: "intraday-robustness",
        title: "How robust was V13?",
        paragraphs: [
          "At 24 bps one-way slippage, matched SIP total return remains 4.37% with Sharpe 0.756. The matched IEX feed produces 3.13% return and 29 positions, versus 45 on SIP. Positive results on both feeds do not imply identical trades.",
          "The best three positions supply 39.6% of net P&L, and the best three symbols supply 47.6%. Most profit is concentrated in 2021, 2022, and 2026; 2023–2025 are slightly negative. The filters remove 20 V12 positions and add none, so this is primarily risk selection over the original signal.",
          "A 100,000-draw session bootstrap reports an approximate 95% return interval of 1.34%–10.56%. It does not adjust for choosing V13’s thresholds after inspecting this history. Shortability, borrow costs, recalls, variable spreads, and partial fills are additional gaps in the historical study.",
        ],
        sources: [
          geld(
            "research-results/intraday-v13-summary.json",
            "Stress and concentration metrics",
          ),
          geld(
            "docs/research/INTRADAY_V13_RESEARCH.md",
            "Selection and execution limitations",
          ),
        ],
      },
      {
        id: "what-didnt-work",
        title: "What didn’t work: more intraday entries",
        paragraphs: [
          "V15 tested re-reading the opening-trend signal at 13:00 and 14:30 instead of acting only at 10:30. The additional entries used the same sizing and chop gate, but increased turnover and weakened the recorded result.",
          "In that specific comparison, the 10:30-only rule returned 3.89% overall with +0.36% validation return and 16.2× turnover. Adding 13:00 reduced overall return to 2.55%, flipped validation to −0.26%, and raised turnover to 17.2×. A third entry at 14:30 produced 2.51%, −0.04%, and 18.4× respectively.",
          "The optional multiple-entry setting was left off and the single 10:30 signal retained. More opportunities to trade did not improve this strategy. These figures belong to the later signal-timing experiment, separate from the cost-sensitivity table below.",
        ],
        sources: [
          geld(
            "docs/research/INTRADAY_V15_RESEARCH.md",
            "Evaluated and not adopted: multiple intraday entries",
          ),
        ],
      },
      {
        id: "v15",
        title: "V15: more activity, with a narrow cost budget",
        paragraphs: [
          "V15 adds a small SPY opening-trend sleeve to the selective stock-short overlay. The current configuration reads the completed 10:30 ET bar, ramps exposure from a weak-signal floor toward full size between 5 and 15 bps of opening movement, and requires a morning efficiency ratio of at least 0.30. The SPY sleeve flattens at 15:30 and the overlay at 15:45.",
          "The recorded matched IEX hybrid diagnostic below keeps stock-overlay cost at 8 bps and varies SPY cost. At 2 bps per side it returns 3.21% with Sharpe 0.809; at 8 bps it loses 2.91%. The repository also records a later confidence-sizing/chop-gate variant at 3.89% total return and Sharpe 1.00. That is a separate refinement, not the same run as this cost table.",
          "Adding midday re-entries worsened the recorded validation result and increased turnover, so the single 10:30 signal was retained. Frequent activity can consume a small edge through implementation costs.",
        ],
        table: {
          caption: "Recorded V15 matched IEX hybrid, July 2020–July 2026",
          columns: [
            "SPY cost per side",
            "Total return",
            "Sharpe",
            "Max drawdown",
          ],
          rows: [
            ["0.5 bps", "4.80%", "1.197", "−0.49%"],
            ["1 bps", "4.26%", "1.068", "−0.54%"],
            ["2 bps", "3.21%", "0.809", "−0.63%"],
            ["4 bps", "1.13%", "0.289", "−1.12%"],
            ["8 bps", "−2.91%", "−0.751", "−3.92%"],
          ],
        },
        sources: [
          geld(
            "docs/research/INTRADAY_V15_RESEARCH.md",
            "V15 experiments and cost table",
          ),
          geld(
            "configs/paper-intra-v15.toml",
            "Current sizing and chop-gate configuration",
          ),
        ],
      },
    ],
  },
  {
    slug: "volatility",
    project: "market-volatility-forecasting",
    title: "Forecasting volatility",
    intro:
      "Next-day variance forecasting across 14 US ETFs, evaluated with quarterly walk-forward refits and explicit baseline comparisons.",
    scope:
      "Committed forecast results for 2020–2025. These describe the saved research run, not a new model run or realized trading performance.",
    facts: [
      { value: "21,098", label: "ETF-day observations" },
      { value: "0.2857", label: "Ensemble mean QLIKE" },
      { value: "39.7%", label: "Lower QLIKE than persistence" },
    ],
    source: "https://github.com/Jiang6082/market-volatility-forecasting",
    sections: [
      {
        id: "protocol",
        title: "Target, features, and temporal splits",
        paragraphs: [
          "The target is next-day Garman–Klass variance, estimated from daily open, high, low, and close prices. Features available through close t predict variance at t+1. Feature groups cover recent volatility, HAR-style daily/weekly/monthly measures, returns, volume, cross-asset signals, and calendar effects.",
          "The expanding protocol starts training in 2015, uses the preceding 12 months for validation, and evaluates contiguous three-month test windows from 2020 through 2025. Each fold fits fresh models; median imputation and standardization use only the training slice. Fold boundaries and model artifact hashes are saved for traceability.",
          "The configured models include persistence, a rolling mean, HAR, Ridge, histogram gradient boosting, a 64/32-unit MLP, GARCH, and EGARCH. The ensemble is the geometric mean of Ridge, GBRT, and MLP variance predictions, computed by averaging their log predictions and exponentiating.",
        ],
        code: "ensemble variance = exp(mean(log(Ridge), log(GBRT), log(MLP)))\nQLIKE(r, h) = r / h − log(r / h) − 1\nr = realized variance proxy; h = forecast variance",
        sources: [
          vol("configs/default.yaml", "Model and split configuration"),
          vol(
            "src/vol_forecast/splits.py",
            "Fold construction and preprocessing",
          ),
          vol(
            "src/vol_forecast/backtest.py",
            "Training loop and geometric ensemble",
          ),
          vol("src/vol_forecast/metrics.py", "Loss definition"),
        ],
      },
      {
        id: "results",
        title: "The full model comparison",
        paragraphs: [
          "The ensemble has the lowest mean QLIKE in the recorded run: 0.285704, approximately 39.7% below persistence and 15.4% below HAR. Ridge is the strongest individual model on that loss, with GBRT and MLP close behind.",
          "The ranking depends on the metric. Although the ensemble wins on QLIKE, its RMSE is larger than persistence’s; Ridge and MLP have much larger RMSE still. QLIKE measures relative variance-forecast error, while RMSE is more sensitive to large absolute errors. The improvement is on the chosen primary loss, not on every error measure.",
        ],
        table: {
          caption:
            "Recorded out-of-sample variance forecasts; lower QLIKE/RMSE is better",
          columns: ["Model", "QLIKE", "RMSE", "Spearman"],
          rows: [
            ["Ensemble", "0.285704", "0.002207", "0.711303"],
            ["Ridge", "0.312344", "0.021862", "0.703984"],
            ["MLP", "0.314651", "0.032489", "0.688240"],
            ["GBRT", "0.315520", "0.000302", "0.702677"],
            ["HAR", "0.337839", "0.000292", "0.683290"],
            ["Rolling mean", "0.357175", "0.000324", "0.618454"],
            ["GARCH", "0.366448", "0.000329", "0.619258"],
            ["EGARCH", "0.377190", "0.000283", "0.616425"],
            ["Persistence", "0.473535", "0.000320", "0.609436"],
          ],
        },
        image: {
          src: "/projects/volatility-prediction.png",
          alt: "Log-scale scatter of ensemble predicted variance against realized variance with a diagonal equality line",
          caption:
            "Committed ensemble output. Distance from the diagonal shows forecast error; both axes use logarithmic scales.",
        },
        sources: [
          vol(
            "reports/tables/metrics_overall.csv",
            "Full-precision metric table",
          ),
          vol(
            "reports/frozen_results.json",
            "Frozen results and provenance hashes",
          ),
          vol("reports/figures/prediction_vs_actual.png", "Original figure"),
        ],
      },
      {
        id: "diagnostics",
        title: "Where the signal comes from",
        paragraphs: [
          "For GBRT, permuting the recent-volatility feature group increases QLIKE by 0.0660, compared with 0.0269 for HAR features and 0.0121 for returns. These are model-specific permutation diagnostics: recent volatility carries the largest measured contribution in this experiment.",
          "The ensemble’s recorded QLIKE is 0.3104 on the highest trailing-volatility subset versus 0.2844 on calmer observations. Its five-day mean-variance QLIKE is 0.1902, but at 21 days HAR slightly beats it, 0.3517 versus 0.3551. The one-day ranking does not transfer unchanged to every horizon.",
        ],
        sources: [
          vol("RESULTS.md", "Feature, regime, and horizon diagnostics"),
          vol(
            "src/vol_forecast/evaluation.py",
            "Trailing-volatility subset definition",
          ),
        ],
      },
      {
        id: "what-didnt-work",
        title: "What didn’t work: treating one metric as the whole result",
        paragraphs: [
          "The ensemble’s lower QLIKE did not translate into lower RMSE. Its recorded QLIKE was 0.285704 versus persistence’s 0.473535, but RMSE was 0.002207 versus 0.000320. Ridge and MLP also had relatively good QLIKE alongside much larger RMSE.",
          "The comparison therefore keeps both metrics and the simpler baselines visible. QLIKE rewards relative variance accuracy; RMSE exposes large absolute misses. At the 21-day horizon, HAR also slightly outperformed the ensemble on QLIKE, so the one-day winner cannot simply be carried over to every horizon.",
          "This remains a limitation of the saved results, not a solved model defect. Inspecting the largest errors and testing any changes on fresh data would be the next step; those improvements are not claimed here.",
        ],
        sources: [
          vol(
            "reports/tables/metrics_overall.csv",
            "QLIKE and RMSE comparison",
          ),
          vol("RESULTS.md", "Forecast-horizon comparison"),
        ],
      },
      {
        id: "uncertainty",
        title: "How much confidence to put in the ranking",
        paragraphs: [
          "The saved 95% bootstrap interval for ensemble mean QLIKE is [0.2664, 0.3066]. The implementation first averages losses across ETFs within each date, then resamples dates independently. This preserves same-date grouping, but does not resample consecutive time blocks or preserve serial dependence.",
          "The results report an ensemble-only 90% Model Confidence Set. The configured ensemble is explicitly described as post-hoc, however, so this comparison should not be presented as a completely untouched test of a preselected ensemble.",
          "The ordinary one-step Diebold–Mariano routine uses the sample standard error of the loss differences. A separate HAC version exists for overlapping multi-horizon forecasts. The recorded ranking is evidence from this experiment; further forward evaluation is needed to establish whether it persists.",
        ],
        sources: [
          vol("src/vol_forecast/evaluation.py", "Bootstrap implementation"),
          vol(
            "src/vol_forecast/metrics.py",
            "Ordinary and HAC comparison tests",
          ),
          vol("configs/default.yaml", "Post-hoc ensemble definition"),
          vol("RESULTS.md", "Confidence-set and interval results"),
        ],
      },
    ],
  },
  {
    slug: "idx-exchange",
    project: "idx-exchange",
    title: "Property Search Platform",
    intro:
      "A React interface and Express API that turn property records into searchable listings, map results, and comparison views.",
    scope:
      "Implementation review of IDX Exchange at commit 224170c. The figures below are configuration limits, not measured throughput or production usage.",
    facts: [
      { value: "5", label: "Allowed sort fields" },
      { value: "20", label: "Default API page size" },
      { value: "10 / 15 s", label: "Map / listing cache TTL" },
    ],
    source: "https://github.com/Jiang6082/idx-exchange",
    sections: [
      {
        id: "request-path",
        title: "From a search to a query",
        paragraphs: [
          "The React listings page keeps filters, sorting, and pagination in UI state and synchronizes that state with URL search parameters. The API client serializes the request for Express; the backend queries MySQL and normalizes raw listing fields into a consistent response.",
          "A page number becomes offset = (page − 1) × itemsPerPage. The backend runs a count query and a separate LIMIT/OFFSET query using the same WHERE conditions, so the interface can render both the result page and pagination controls.",
        ],
        code: "React filters + URL state → GET /api/properties\n  → validate query → cache lookup\n  → COUNT(*) + SELECT … LIMIT ? OFFSET ?\n  → serializePropertySummary → cards / map",
        sources: [
          idx(
            "frontend/src/pages/ListingsPage.js",
            "Listing state and pagination",
          ),
          idx("frontend/src/api/client.js", "API client"),
          idx("backend/src/routes/properties.js", "Search route"),
        ],
      },
      {
        id: "query-contract",
        title: "A bounded query contract",
        paragraphs: [
          "Text, city, ZIP, price, beds, and baths become parameterized SQL conditions. Sort columns require a separate allowlist because SQL placeholders bind values, not identifiers. The route allows price, listing date, square footage, bedroom count, and days on market; unsupported fields return HTTP 400.",
          "The API defaults to 20 rows with offset zero and accepts limits from 1 to 1,000. It rejects inverted price ranges and incomplete map bounds. These are useful guardrails; the parsing still uses parseInt for pagination, and large offsets or broad LIKE searches would need query-plan and load testing before making scale claims.",
        ],
        table: {
          caption: "Search contract in the repository",
          columns: ["Input", "Implementation"],
          rows: [
            ["City", "Case-insensitive exact match after trimming"],
            [
              "Free text",
              "LIKE across city, address, street, listing and display IDs",
            ],
            ["Price / beds / baths", "Bound SQL values"],
            ["Sort", "Five allowlisted fields; ASC or DESC"],
            ["Pagination", "COUNT plus LIMIT/OFFSET"],
          ],
        },
        sources: [
          idx(
            "backend/src/routes/properties.js",
            "Validation and SQL construction",
          ),
        ],
      },
      {
        id: "map-cache",
        title: "Map bounds and short-lived caching",
        paragraphs: [
          "Map searches pass north, south, east, and west together. The SQL restricts latitude and longitude with BETWEEN and excludes missing or zero coordinates. A mapOnly response selects fewer columns than a full listing request.",
          "Search responses are cached for 10 seconds in map mode and 15 seconds otherwise. The cache module attempts Redis when configured and falls back to an in-process Map when unavailable; Redis is an optional dependency, not included in the backend manifest. The key uses the serialized query object, so differently ordered equivalent parameters can create separate entries.",
          "Optional price analytics are calculated from the returned page of rows, while total comes from all matching rows. The displayed median is the upper middle observation for even page sizes. These page-level summaries should not be presented as whole-market statistics.",
        ],
        sources: [
          idx(
            "backend/src/routes/properties.js",
            "Map projection, cache TTL, and analytics",
          ),
          idx("backend/src/utils/cache.js", "Redis and memory cache"),
          idx("backend/package.json", "Installed backend dependencies"),
        ],
      },
      {
        id: "details",
        title: "Turning raw records into useful views",
        paragraphs: [
          "The detail route adds a timestamp-based listing timeline, city-level aggregate statistics, and up to four related properties in the same city within a ±20% price band. Those related results are sorted by absolute price distance.",
          "The comparison route accepts at least two IDs, truncates the input to four, and restores requested ordering after the database query. Serialization centralizes property names and formatting so cards, detail pages, and comparisons do not each need to understand the raw database schema.",
        ],
        sources: [
          idx(
            "backend/src/routes/properties.js",
            "Details and comparison endpoints",
          ),
          idx(
            "backend/src/utils/propertyTransforms.js",
            "Property serialization",
          ),
        ],
      },
      {
        id: "what-didnt-work",
        title: "What still needs work: equivalent searches miss the cache",
        paragraphs: [
          "The cache key is built with JSON.stringify(query). Two equivalent searches can therefore get different keys when their parameters arrive in a different order. For example, city=Portland&beds=3 and beds=3&city=Portland describe the same filters but can occupy separate cache entries.",
          "The existing 10- or 15-second expiry limits how long those entries remain useful, but does not make the keys equivalent. This is a source-level limitation, not a measured production incident or a documented performance regression.",
          "A proposed fix is to build the key from validated, normalized parameters in a fixed order, including defaults, sorting, pagination, and map bounds. Tests should verify that equivalent searches share a key while different pages and filters remain distinct. That change has not been implemented in the linked revision.",
        ],
        sources: [
          idx("backend/src/utils/cache.js", "Current cache-key construction"),
          idx(
            "backend/src/routes/properties.js",
            "Query inputs and cache lookup",
          ),
        ],
      },
      {
        id: "validation",
        title: "What the tests establish",
        paragraphs: [
          "The repository contains backend tests for invalid prices, unsupported sorting, excessive query text, insufficient comparison IDs, and authenticated routes. Frontend tests exercise API query construction and pagination behavior, including first/last-page boundaries.",
          "These tests target request contracts and UI behavior. They do not establish production latency, database throughput, user counts, or end-to-end correctness against a live listing feed. The walkthrough therefore reports architecture and implementation details rather than invented benchmark results.",
        ],
        sources: [
          idx("backend/test/app.test.js", "Backend request tests"),
          idx("frontend/src/api/client.test.js", "API client tests"),
          idx("frontend/src/components/Pagination.test.js", "Pagination tests"),
        ],
      },
    ],
  },
];
