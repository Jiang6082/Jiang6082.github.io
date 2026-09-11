// Standard-normal CDF approximation (absolute error below 8e-8).
export function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const tail =
    (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) *
    t *
    (0.31938153 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - tail : tail;
}
// European call, no dividends. All rates are annual decimals; time is in years.
export function callValue(spot, strike, years, volatility, rate) {
  if (
    ![spot, strike, years, volatility, rate].every(Number.isFinite) ||
    spot <= 0 ||
    strike <= 0 ||
    years < 0 ||
    volatility < 0
  )
    throw new RangeError("Invalid model input");
  if (years === 0) return Math.max(spot - strike, 0);
  if (volatility === 0)
    return Math.max(spot - strike * Math.exp(-rate * years), 0);
  const spread = volatility * Math.sqrt(years);
  const d1 =
    (Math.log(spot / strike) + (rate + (volatility * volatility) / 2) * years) /
    spread;
  return Math.max(
    0,
    spot * normalCDF(d1) -
      strike * Math.exp(-rate * years) * normalCDF(d1 - spread),
  );
}
