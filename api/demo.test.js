import test from "node:test";
import assert from "node:assert/strict";
import { analyzeMutations, forecastVolatility, priceOption, searchProperties } from "./demo.js";

test("prices a European call near its analytical benchmark", () => {
  const result = priceOption({ paths: 100000, seed: 42 });
  assert.ok(result.absoluteError < 0.15);
  assert.ok(result.confidenceInterval[0] < result.blackScholes);
  assert.ok(result.confidenceInterval[1] > result.blackScholes);
});

test("forecasts Parkinson volatility from high-low observations", () => {
  const observations = Array.from({ length: 20 }, (_, index) => ({ high: 101 + index * 0.1, low: 99 + index * 0.1 }));
  const result = forecastVolatility({ observations });
  assert.equal(result.observations, 20);
  assert.ok(result.nextDayForecast > 0);
});

test("filters and sorts property listings", () => {
  const result = searchProperties({ city: "Chicago", maxPrice: 800000, minBeds: 2, sort: "price-desc" });
  assert.ok(result.listings.length > 0);
  assert.ok(result.listings.every((listing) => listing.city === "Chicago" && listing.price <= 800000));
});

test("classifies substitutions and insertions", () => {
  const result = analyzeMutations({ reference: "ACGTACGT", sample: "ACCTTACGT" });
  assert.equal(result.counts.substitution, 1);
  assert.equal(result.counts.insertion, 1);
  assert.ok(result.identity > 0.7);
});
