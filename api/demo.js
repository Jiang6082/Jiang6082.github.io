const SQRT_2PI = Math.sqrt(2 * Math.PI);

const listings = [
  { id: "CHI-101", city: "Chicago", neighborhood: "West Loop", price: 785000, beds: 3, baths: 2, sqft: 1840, type: "Condo", accent: "#d5a373" },
  { id: "CHI-102", city: "Chicago", neighborhood: "Logan Square", price: 624500, beds: 2, baths: 2, sqft: 1420, type: "Condo", accent: "#8ea5a4" },
  { id: "CHI-103", city: "Chicago", neighborhood: "Lincoln Park", price: 1195000, beds: 4, baths: 3, sqft: 2680, type: "Townhouse", accent: "#9f826c" },
  { id: "EVN-201", city: "Evanston", neighborhood: "Central Street", price: 845000, beds: 4, baths: 3, sqft: 2540, type: "House", accent: "#6f8d78" },
  { id: "EVN-202", city: "Evanston", neighborhood: "Downtown", price: 489000, beds: 2, baths: 2, sqft: 1280, type: "Condo", accent: "#8296ad" },
  { id: "OAK-301", city: "Oak Park", neighborhood: "Frank Lloyd Wright District", price: 975000, beds: 5, baths: 3, sqft: 3120, type: "House", accent: "#b57862" },
  { id: "CHI-104", city: "Chicago", neighborhood: "Hyde Park", price: 565000, beds: 3, baths: 2, sqft: 1650, type: "Condo", accent: "#708d9d" },
  { id: "CHI-105", city: "Chicago", neighborhood: "Wicker Park", price: 899000, beds: 3, baths: 3, sqft: 2100, type: "Townhouse", accent: "#aa8f66" }
];

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalCdf(x) {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * z);
  const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return 0.5 * (1 + sign * erf);
}

function blackScholes({ spot, strike, rate, volatility, maturity, optionType }) {
  const d1 = (Math.log(spot / strike) + (rate + 0.5 * volatility ** 2) * maturity) / (volatility * Math.sqrt(maturity));
  const d2 = d1 - volatility * Math.sqrt(maturity);
  if (optionType === "put") {
    return strike * Math.exp(-rate * maturity) * normalCdf(-d2) - spot * normalCdf(-d1);
  }
  return spot * normalCdf(d1) - strike * Math.exp(-rate * maturity) * normalCdf(d2);
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormal(random) {
  const u1 = Math.max(random(), Number.EPSILON);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function priceOption(input = {}) {
  const spot = clampNumber(input.spot, 1, 10000, 100);
  const strike = clampNumber(input.strike, 1, 10000, 100);
  const rate = clampNumber(input.rate, -0.1, 0.5, 0.03);
  const volatility = clampNumber(input.volatility, 0.01, 2, 0.2);
  const maturity = clampNumber(input.maturity, 1 / 365, 10, 1);
  const paths = Math.round(clampNumber(input.paths, 1000, 100000, 25000));
  const seed = Math.round(clampNumber(input.seed, 1, 2147483647, 42));
  const optionType = input.optionType === "put" ? "put" : "call";
  const random = mulberry32(seed);
  const discount = Math.exp(-rate * maturity);
  const drift = (rate - 0.5 * volatility ** 2) * maturity;
  const diffusion = volatility * Math.sqrt(maturity);
  let sum = 0;
  let sumSquares = 0;

  for (let i = 0; i < paths; i += 1) {
    const terminal = spot * Math.exp(drift + diffusion * standardNormal(random));
    const payoff = optionType === "call" ? Math.max(terminal - strike, 0) : Math.max(strike - terminal, 0);
    const discounted = discount * payoff;
    sum += discounted;
    sumSquares += discounted ** 2;
  }

  const price = sum / paths;
  const variance = Math.max(0, (sumSquares - paths * price ** 2) / (paths - 1));
  const standardError = Math.sqrt(variance / paths);
  const benchmark = blackScholes({ spot, strike, rate, volatility, maturity, optionType });
  return {
    inputs: { spot, strike, rate, volatility, maturity, paths, seed, optionType },
    monteCarlo: price,
    blackScholes: benchmark,
    absoluteError: Math.abs(price - benchmark),
    standardError,
    confidenceInterval: [price - 1.96 * standardError, price + 1.96 * standardError]
  };
}

export function forecastVolatility(input = {}) {
  const observations = Array.isArray(input.observations) ? input.observations.slice(-60) : [];
  if (observations.length < 5) throw new Error("Provide at least five high-low observations.");
  const daily = observations.map((row, index) => {
    const high = clampNumber(row.high, 0.0001, 1000000, NaN);
    const low = clampNumber(row.low, 0.0001, 1000000, NaN);
    if (!Number.isFinite(high) || !Number.isFinite(low) || high < low) throw new Error(`Invalid high-low pair at row ${index + 1}.`);
    return Math.sqrt((Math.log(high / low) ** 2) / (4 * Math.log(2)));
  });
  const rolling = daily.reduce((sum, value) => sum + value, 0) / daily.length;
  const alpha = 2 / (Math.min(20, daily.length) + 1);
  const ewma = daily.slice(1).reduce((value, current) => alpha * current + (1 - alpha) * value, daily[0]);
  const latest = daily[daily.length - 1];
  const forecast = 0.55 * ewma + 0.3 * rolling + 0.15 * latest;
  return {
    observations: daily.length,
    dailyParkinson: daily,
    latest,
    rollingMean: rolling,
    ewma,
    nextDayForecast: forecast,
    annualizedForecast: forecast * Math.sqrt(252)
  };
}

export function searchProperties(input = {}) {
  const city = String(input.city || "").trim().toLowerCase();
  const maxPrice = clampNumber(input.maxPrice, 100000, 10000000, 10000000);
  const minBeds = Math.round(clampNumber(input.minBeds, 0, 10, 0));
  const type = String(input.type || "").trim().toLowerCase();
  const sort = ["price-asc", "price-desc", "sqft-desc"].includes(input.sort) ? input.sort : "price-asc";
  const page = Math.round(clampNumber(input.page, 1, 100, 1));
  const pageSize = Math.round(clampNumber(input.pageSize, 1, 6, 4));
  const filtered = listings.filter((listing) =>
    (!city || `${listing.city} ${listing.neighborhood}`.toLowerCase().includes(city)) &&
    listing.price <= maxPrice && listing.beds >= minBeds && (!type || listing.type.toLowerCase() === type)
  );
  filtered.sort((a, b) => sort === "price-desc" ? b.price - a.price : sort === "sqft-desc" ? b.sqft - a.sqft : a.price - b.price);
  const start = (page - 1) * pageSize;
  return { total: filtered.length, page, pageSize, pages: Math.max(1, Math.ceil(filtered.length / pageSize)), listings: filtered.slice(start, start + pageSize) };
}

function alignSequences(reference, sample) {
  const rows = reference.length + 1;
  const columns = sample.length + 1;
  const scores = Array.from({ length: rows }, () => new Int16Array(columns));
  const traces = Array.from({ length: rows }, () => new Uint8Array(columns));
  for (let i = 1; i < rows; i += 1) { scores[i][0] = -i; traces[i][0] = 2; }
  for (let j = 1; j < columns; j += 1) { scores[0][j] = -j; traces[0][j] = 3; }
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < columns; j += 1) {
      const diagonal = scores[i - 1][j - 1] + (reference[i - 1] === sample[j - 1] ? 2 : -1);
      const up = scores[i - 1][j] - 1;
      const left = scores[i][j - 1] - 1;
      const best = Math.max(diagonal, up, left);
      scores[i][j] = best;
      traces[i][j] = best === diagonal ? 1 : best === up ? 2 : 3;
    }
  }
  let i = reference.length;
  let j = sample.length;
  let alignedReference = "";
  let alignedSample = "";
  while (i > 0 || j > 0) {
    const trace = traces[i][j];
    if (trace === 1) { alignedReference = reference[i - 1] + alignedReference; alignedSample = sample[j - 1] + alignedSample; i -= 1; j -= 1; }
    else if (trace === 2) { alignedReference = reference[i - 1] + alignedReference; alignedSample = "-" + alignedSample; i -= 1; }
    else { alignedReference = "-" + alignedReference; alignedSample = sample[j - 1] + alignedSample; j -= 1; }
  }
  return { alignedReference, alignedSample, score: scores[reference.length][sample.length] };
}

export function analyzeMutations(input = {}) {
  const clean = (value) => String(value || "").toUpperCase().replace(/[^ACGTN]/g, "").slice(0, 500);
  const reference = clean(input.reference);
  const sample = clean(input.sample);
  if (!reference || !sample) throw new Error("Reference and sample sequences are required.");
  const alignment = alignSequences(reference, sample);
  const mutations = [];
  let matches = 0;
  let referencePosition = 0;
  for (let i = 0; i < alignment.alignedReference.length; i += 1) {
    const ref = alignment.alignedReference[i];
    const observed = alignment.alignedSample[i];
    if (ref !== "-") referencePosition += 1;
    if (ref === observed) matches += 1;
    else mutations.push({ position: referencePosition, reference: ref, sample: observed, type: ref === "-" ? "insertion" : observed === "-" ? "deletion" : "substitution" });
  }
  const counts = mutations.reduce((result, mutation) => ({ ...result, [mutation.type]: (result[mutation.type] || 0) + 1 }), { substitution: 0, insertion: 0, deletion: 0 });
  return { ...alignment, referenceLength: reference.length, sampleLength: sample.length, identity: matches / alignment.alignedReference.length, counts, mutations };
}

function corsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const allowed = origin === "https://jiang6082.github.io" || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "https://jiang6082.github.io",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin"
  };
}

function response(request, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) });
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
    const url = new URL(request.url);
    const tool = url.searchParams.get("tool") || "health";
    if (tool === "health") return response(request, { status: "ok", service: "Jiang6082 project demos" });
    if (request.method !== "POST") return response(request, { error: "Use POST for demo calculations." }, 405);
    try {
      const input = await request.json();
      const result = tool === "options" ? priceOption(input) : tool === "volatility" ? forecastVolatility(input) : tool === "properties" ? searchProperties(input) : tool === "mutations" ? analyzeMutations(input) : null;
      return result ? response(request, result) : response(request, { error: "Unknown demo tool." }, 404);
    } catch (error) {
      return response(request, { error: error instanceof Error ? error.message : "Invalid request." }, 400);
    }
  }
};

