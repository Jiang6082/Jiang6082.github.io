---
title: IDX Exchange
year: 2026
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

