// Illustrative expiry payoff only; no option-pricing model or trading signal.
export function longCallProfit(spot, strike, premium) {
  return Math.max(spot - strike, 0) - premium;
}
