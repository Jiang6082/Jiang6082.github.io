const DEMO_API = 'https://jiang6082-project-demos.vercel.app/api/demo';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const formatNumber = (value, digits = 4) => Number(value).toLocaleString(undefined, {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});

const metric = (label, value) => `<div class="demo-metric"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`;

async function callDemo(tool, payload) {
  const response = await fetch(`${DEMO_API}?tool=${encodeURIComponent(tool)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'The demo API returned an error.');
  return data;
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function renderVolatility(result) {
  const maximum = Math.max(...result.dailyParkinson);
  const bars = result.dailyParkinson.map((value) => {
    const height = Math.max(5, (value / maximum) * 100);
    return `<i style="height:${height.toFixed(1)}%" title="${formatNumber(value, 5)}"></i>`;
  }).join('');
  return `<div class="demo-metrics">
    ${metric('Next-day forecast', formatNumber(result.nextDayForecast, 5))}
    ${metric('Annualized', `${formatNumber(result.annualizedForecast * 100, 2)}%`)}
    ${metric('EWMA', formatNumber(result.ewma, 5))}
  </div><div class="volatility-bars" aria-label="Daily Parkinson volatility observations">${bars}</div>`;
}

function renderOptions(result) {
  return `<div class="demo-metrics">
    ${metric('Monte Carlo', formatNumber(result.monteCarlo, 6))}
    ${metric('Black-Scholes', formatNumber(result.blackScholes, 6))}
    ${metric('Absolute error', formatNumber(result.absoluteError, 6))}
    ${metric('Standard error', formatNumber(result.standardError, 6))}
  </div><p class="demo-footnote">95% confidence interval: <strong>${formatNumber(result.confidenceInterval[0], 6)} &ndash; ${formatNumber(result.confidenceInterval[1], 6)}</strong> from ${result.inputs.paths.toLocaleString()} seeded paths.</p>`;
}

function renderProperties(result) {
  if (!result.listings.length) return '<p class="demo-empty">No demo listings match those filters.</p>';
  const cards = result.listings.map((listing) => `<article class="property-result">
    <div class="property-swatch" style="background:${escapeHtml(listing.accent)}"><span>${escapeHtml(listing.type)}</span></div>
    <div><small>${escapeHtml(listing.id)} / ${escapeHtml(listing.neighborhood)}</small><strong>$${Number(listing.price).toLocaleString()}</strong><p>${listing.beds} bd &middot; ${listing.baths} ba &middot; ${Number(listing.sqft).toLocaleString()} sqft</p></div>
  </article>`).join('');
  return `<p class="demo-summary">${result.total} result${result.total === 1 ? '' : 's'} returned by the API</p><div class="property-result-grid">${cards}</div>`;
}

function alignmentMarkup(reference, sample) {
  let referenceLine = '';
  let sampleLine = '';
  for (let index = 0; index < reference.length; index += 1) {
    const differs = reference[index] !== sample[index];
    referenceLine += `<span${differs ? ' class="base-difference"' : ''}>${escapeHtml(reference[index])}</span>`;
    sampleLine += `<span${differs ? ' class="base-difference"' : ''}>${escapeHtml(sample[index])}</span>`;
  }
  return `<div class="alignment"><div><b>REF</b><code>${referenceLine}</code></div><div><b>OBS</b><code>${sampleLine}</code></div></div>`;
}

function renderMutations(result) {
  return `<div class="demo-metrics">
    ${metric('Identity', `${formatNumber(result.identity * 100, 2)}%`)}
    ${metric('Substitutions', result.counts.substitution)}
    ${metric('Insertions', result.counts.insertion)}
    ${metric('Deletions', result.counts.deletion)}
  </div>${alignmentMarkup(result.alignedReference, result.alignedSample)}
  <div class="mutation-table"><strong>Mutation calls</strong>${result.mutations.length ? result.mutations.slice(0, 20).map((item) => `<span>Position ${item.position}: ${escapeHtml(item.reference)} &rarr; ${escapeHtml(item.sample)} <small>${escapeHtml(item.type)}</small></span>`).join('') : '<span>No mutations detected.</span>'}</div>`;
}

document.querySelectorAll('.demo-panel').forEach((panel) => {
  const form = panel.querySelector('form');
  const status = panel.querySelector('.demo-status');
  const results = panel.querySelector('.demo-results');
  const tool = panel.dataset.demo;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Running on the backend...';
    status.classList.remove('is-error');
    try {
      const values = formValues(form);
      let payload = values;
      if (tool === 'volatility') {
        payload = { observations: values.observations.split(/\n+/).filter(Boolean).map((row) => {
          const [high, low] = row.split(',').map(Number);
          return { high, low };
        }) };
      }
      const result = await callDemo(tool, payload);
      results.innerHTML = tool === 'volatility' ? renderVolatility(result) : tool === 'options' ? renderOptions(result) : tool === 'properties' ? renderProperties(result) : renderMutations(result);
      status.textContent = 'Completed by the live API.';
    } catch (error) {
      status.textContent = error.message || 'The demo could not be completed.';
      status.classList.add('is-error');
      results.innerHTML = '';
    } finally {
      button.disabled = false;
    }
  });
});

