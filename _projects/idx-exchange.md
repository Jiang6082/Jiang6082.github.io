---
title: IDX Exchange
year: 2026
order: 3
summary: A full-stack property-search platform inspired by Zillow and Redfin, combining rich search workflows with account, seller, agent, and integration tooling.
tags: [React, Node.js, Express, MySQL]
project_url: https://github.com/Jiang6082/idx-exchange
image: /assets/images/projects/idx-exchange/search-interface.svg
image_alt: Illustrated IDX Exchange property search dashboard
metrics:
  - label: Front end
    value: React
  - label: API
    value: Express
  - label: Data layer
    value: MySQL
---

IDX Exchange is a Zillow/Redfin-style application built across a React client, REST API, and Dockerized MySQL database. The core experience supports property discovery with pagination, filters, saved search state, listing details, favorites, and map-based browsing.

## More than a listing grid

The application expands beyond basic search into saved homes, user authentication, agent workspaces, seller tools, market insights, integrations, and property alerts. Loading skeletons, toast feedback, error boundaries, rate limiting, validation, and indexed queries make the product feel considered on both sides of the API.

<div class="architecture" aria-label="Application architecture">
  <div><small>Client</small><strong>React</strong><span>Search, maps, workspaces</span></div>
  <b>&rarr;</b>
  <div><small>Service</small><strong>Express API</strong><span>Auth, listings, insights</span></div>
  <b>&rarr;</b>
  <div><small>Storage</small><strong>MySQL</strong><span>Indexed property data</span></div>
</div>

## Product surface

The front end is organized into focused pages for listings, property details, saved homes, authentication, the agent dashboard, seller tools, insights, integrations, and a personal workspace. Shared hooks handle account and favorite state, while URL search state keeps filtered results navigable and shareable.

## Backend design

Express routes separate authentication, users, properties, AI features, seller workflows, integrations, insights, and experience APIs. Database bootstrap logic keeps local setup reproducible, while caching, rate limiting, property transforms, and tests cover the boundaries that usually become fragile in a full-stack application.

## Search the demo inventory

These controls query a server-side listing endpoint with price, bedroom, property-type, sorting, and pagination logic. The demo inventory is intentionally synthetic; no real listing data or personal information is collected.

<section class="demo-panel" data-demo="properties">
  <form class="demo-form demo-form-grid">
    <label class="demo-field"><span>City or neighborhood</span><input name="city" type="search" placeholder="Chicago"></label>
    <label class="demo-field"><span>Maximum price</span><input name="maxPrice" type="number" value="900000" min="100000" step="25000"></label>
    <label class="demo-field"><span>Minimum beds</span><select name="minBeds"><option value="0">Any</option><option value="2" selected>2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
    <label class="demo-field"><span>Property type</span><select name="type"><option value="">Any</option><option>Condo</option><option>Townhouse</option><option>House</option></select></label>
    <label class="demo-field"><span>Sort</span><select name="sort"><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="sqft-desc">Largest first</option></select></label>
    <button class="demo-submit" type="submit">Search listings</button>
  </form>
  <div class="demo-status" aria-live="polite">Ready to query the backend.</div>
  <div class="demo-results property-results"></div>
</section>
