export const sampleHomes = [
  { id: "A", city: "Portland", price: 420000, beds: 2, sqft: 1180 },
  { id: "B", city: "Portland", price: 585000, beds: 3, sqft: 1740 },
  { id: "C", city: "Seattle", price: 740000, beds: 3, sqft: 1620 },
  { id: "D", city: "Chicago", price: 315000, beds: 2, sqft: 1050 },
  { id: "E", city: "Chicago", price: 510000, beds: 4, sqft: 2180 },
  { id: "F", city: "Seattle", price: 465000, beds: 1, sqft: 790 },
  { id: "G", city: "Portland", price: 690000, beds: 4, sqft: 2260 },
  { id: "H", city: "Chicago", price: 265000, beds: 1, sqft: 720 },
];
export function filterHomes({
  city = "",
  price = 1000000,
  beds = 0,
  sort = "asc",
  page = 1,
}) {
  const rows = sampleHomes
    .filter(
      (h) => (!city || h.city === city) && h.price <= price && h.beds >= beds,
    )
    .sort((a, b) => (sort === "desc" ? b.price - a.price : a.price - b.price));
  const pages = Math.max(1, Math.ceil(rows.length / 3));
  const current = Math.max(1, Math.min(page, pages));
  return {
    total: rows.length,
    pages,
    page: current,
    rows: rows.slice((current - 1) * 3, current * 3),
  };
}
export const samplePValues = [
  0.003, 0.009, 0.021, 0.038, 0.047, 0.12, 0.34, 0.78,
];
export function selectedHypotheses(values, alpha, method) {
  if (method === "raw")
    return values.map((p, i) => (p <= alpha ? i : -1)).filter((i) => i >= 0);
  const sorted = values.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  let last = -1;
  sorted.forEach(({ p }, i) => {
    if (p <= ((i + 1) * alpha) / values.length) last = i;
  });
  return sorted.slice(0, last + 1).map((v) => v.i);
}
// Fictional annualized volatility (%): quiet period, shock, gradual recovery.
export const sampleVolatility = Array.from({ length: 42 }, (_, i) =>
  Number(
    (i < 20
      ? 14 + 2 * Math.sin(i * 1.2)
      : i < 24
        ? 42 - (i - 20) * 3
        : 17 + 17 * Math.exp(-(i - 24) / 5) + Math.sin(i)
    ).toFixed(2),
  ),
);
export function forecastAt(series, day, window) {
  if (!Number.isInteger(day) || day < 1 || day >= series.length || window < 1)
    throw new RangeError("Invalid forecast window");
  // Mean past variance, returned as volatility. The target day is never used.
  const past = series.slice(Math.max(0, day - window), day);
  return Math.sqrt(past.reduce((s, v) => s + v * v, 0) / past.length);
}
export function qlike(actualVol, forecastVol) {
  const ratio = (actualVol / forecastVol) ** 2;
  return ratio - Math.log(ratio) - 1;
}
