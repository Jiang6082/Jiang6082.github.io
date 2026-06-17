---
title: Market Volatility Forecasting
year: 2026
summary: An end-to-end quantitative machine-learning pipeline for forecasting next-day realized volatility across 14 liquid U.S. equity and sector ETFs.
tags: [Python, Machine Learning, Time Series, PyTorch]
project_url: https://github.com/Jiang6082/market-volatility-forecasting
image: /assets/images/projects/market-volatility/model-comparison.png
image_alt: Bar chart comparing model error on the held-out test set
metrics:
  - label: ETF-day observations
    value: 36,804
  - label: ETFs modeled
    value: 14
  - label: MAE improvement
    value: 14.74%
---

The project treats volatility forecasting as a research pipeline rather than a one-off notebook. Raw OHLCV data is validated and transformed into leakage-safe features; models are evaluated with chronological splits, walk-forward folds, ETF slices, regime analysis, and feature-group ablations.

## Research design

The primary target is next-day Parkinson realized volatility. Because it uses each day&rsquo;s high-low range, it captures more information than a close-to-close return while remaining compatible with daily market data. Features use only information available through the close of day `t`, and targets are shifted within each ETF to day `t+1`.

<div class="process-flow" aria-label="Research pipeline">
  <span>OHLCV panel</span><b>&rarr;</b><span>Leakage-safe features</span><b>&rarr;</b><span>Chronological validation</span><b>&rarr;</b><span>Models &amp; diagnostics</span>
</div>

## What the evaluation found

On the 2024&ndash;2025 held-out test period, the random forest produced the lowest MAE at `0.002432`. That is a verified **14.74% improvement** over the primary 20-day rolling Parkinson baseline. Gradient boosting and the PyTorch MLP also beat that baseline.

<figure class="project-figure">
  <img src="{{ '/assets/images/projects/market-volatility/prediction-vs-actual.png' | relative_url }}" alt="Scatter plot comparing predicted and actual next-day volatility">
  <figcaption>Held-out predictions versus realized volatility. The evaluation also reports performance by ETF and volatility regime.</figcaption>
</figure>

## Engineering depth

The repository includes deterministic sample-data generation, download and feature CLIs, model artifacts, a self-contained visual dashboard, and tests for target alignment, adjusted-close policy, split ordering, leakage resistance, metrics, and reporting. The design makes every headline result traceable to generated output rather than a hand-written claim.

