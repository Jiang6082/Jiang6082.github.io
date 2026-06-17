---
title: Monte Carlo Options Engine
year: 2026
summary: A tested quantitative-finance package for pricing European, Asian, digital, barrier, and American-style options with analytical benchmarks and variance reduction.
tags: [Python, NumPy, Quantitative Finance, Simulation]
project_url: https://github.com/Jiang6082/monte-carlo-options-experiment
image: /assets/images/projects/monte-carlo/dashboard.png
image_alt: Dashboard presenting Monte Carlo options pricing results
metrics:
  - label: Simulated paths
    value: 500,000
  - label: Test coverage
    value: 85%
  - label: Tests
    value: 43 passing
---

This experiment grew into an importable pricing package with vectorized simulation, uncertainty estimates, analytical validation, Greeks, implied volatility, stochastic-volatility paths, a CLI, executed notebooks, and a browser-based pricing lab.

## Validation before complexity

For `S0=100`, `K=100`, `r=3%`, `sigma=20%`, and one year to maturity, the 500,000-path European call estimate is `9.414024`. The Black-Scholes benchmark is `9.413403`, an absolute pricing error of just **0.000620**.

<figure class="project-figure project-figure-wide">
  <img src="{{ '/assets/images/projects/monte-carlo/convergence-error.png' | relative_url }}" alt="Log-log chart showing Monte Carlo convergence error">
  <figcaption>Empirical standard error follows the expected inverse square-root relationship with path count.</figcaption>
</figure>

## Variance reduction and advanced models

Antithetic variates, moment matching, Sobol draws, Brownian bridges, and control variates make the estimator more efficient. In the verified experiment, the terminal-stock control variate reduced estimator variance by **83.14%**. The package also includes Longstaff-Schwartz regression for an American put, Heston paths, continuous barrier benchmarks, and synthetic implied-volatility calibration.

<figure class="project-figure project-figure-wide">
  <img src="{{ '/assets/images/projects/monte-carlo/implied-vol-smile.png' | relative_url }}" alt="Implied volatility smile across option strikes">
  <figcaption>A synthetic implied-volatility smile used to exercise the calibration workflow.</figcaption>
</figure>

## Built as software

The project is packaged with typed dataclasses, reproducible seeds, 43 tests, 85% coverage, Ruff, mypy, CI, MkDocs, pre-commit hooks, and a command-line interface. The result is both a numerical-methods experiment and a reusable piece of software.
