---
title: "Livability Analysis of Tallinn Using Agentic Coding"
description: "A network-distance livability score for every apartment building in Tallinn, Estonia — built end-to-end by directing an AI coding agent through data ingestion, routing, scoring, and validation."
intro: >
  A network-distance livability score for 7,842 apartment buildings in
  Tallinn, Estonia, combining real walkable access to transit, groceries,
  gyms, and green/blue space into a single, validated score — with the
  entire pipeline built by directing an AI coding agent end-to-end.
date: 2026-08-25
image: "/assets/images/tallinn-livability-map-detail"
tags: ["Agentic Coding", "Urban Analytics", "Network Analysis", "Python"]
featured: true
github_url: "https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/tallinn-livability-analysis"
live_url: ""
project_status: "Completed"
---

## The Question

Which apartment buildings in Tallinn are genuinely livable — based on real walkable access to transit, groceries, gyms, and green or blue space, not straight-line distance on a map? And could a full spatial-data pipeline — ingestion, network routing, scoring, validation, and an interactive map — be built and shipped by one person directing an AI coding agent, instead of a team hand-writing every line?

## Approach: Agentic Coding

The entire pipeline — four analysis notebooks plus a report generator — was built by directing **Claude Code** end-to-end: reading Estonia's open-data registries, tracing a dead GTFS feed URL to its replacement, writing the network-routing and scoring logic, and generating the validation charts and PDF report. My role was to steer scope, choose the scoring methodology, review the agent's code and results at each stage, and decide what to cut — including dropping a data source (building energy class) once validation showed it wasn't reliable enough to score on — rather than writing the geospatial code by hand.

## Data Sources

- **ETAK** (Estonian Topographic Database) — building footprints: 7,842 apartment buildings (3+ units)
- **EHR** (Estonian Building Register) — energy class, address: 3,807 buildings with data on file
- **ETAK** — green and blue space polygons: 3,128 polygons
- **OpenStreetMap** — street network for walking routes: 277,733 nodes
- **Ühistranspordiregister** (Estonian Public Transport Register, GTFS) — transit stops: 1,319 stops
- **OpenStreetMap** (Overpass API) — grocery stores and gyms: 236 / 56 locations

Buildings are limited to apartment buildings with 3 or more units, clipped to the Tallinn city boundary.

## Methodology

- Snapped every building and amenity to the real pedestrian street network, not straight-line distance
- Ran multi-source Dijkstra routing to find the network-shortest distance from each building to its nearest transit stop, grocery store, gym, and green/blue space
- Applied distance decay so a location exactly at a factor's typical walking threshold scores halfway, rather than a hard cutoff
- Normalized each of the four proximity factors to a common 0–100 scale
- Combined them with a geometric mean / Mazziotta-Pareto aggregation, so one very poor factor can't be fully offset by strong scores elsewhere
- Classified buildings into five data-driven livability categories with Natural Breaks
- Evaluated building energy class as a possible fifth factor, then excluded it — only about half of buildings had a certificate on file, and no reliable renovation date existed for any building; it's still shown on the map for reference

## Validation

- Manually reviewed the highest- and lowest-scoring buildings, catching a real bug: ~2% of buildings were scoring as if they had no nearby amenities at all, from a gap in the street network — fixed, every building now routes correctly
- Checked district-level averages against local knowledge: well-connected Lasnamäe and Põhja-Tallinna score highest, quieter Pirita lowest
- Ran a 300-iteration Monte Carlo sensitivity test on the scoring assumptions: small, reasonable changes barely move results (86% of buildings keep their category); large, unrealistic changes move them a lot, as expected

## Result

7,842 Tallinn apartment buildings scored across four equally-weighted proximity factors into five livability categories, validated against local knowledge and assumption sensitivity, and published as a searchable interactive map — anyone can look up a specific address and see exactly why it scored the way it did.

## Links

- [Read the methodology summary (PDF) →](/assets/reports/Tallinn-Livability-Methodology.pdf)
- [Open the interactive map (full screen) →](/assets/tallinn-livability-map.html)
- [Code & notebooks (GitHub) →](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/tallinn-livability-analysis)

## Score Distribution

{{< project-figure src="/assets/images/tallinn-score-distribution" alt="Histogram of final livability scores from 0 to 100, shaded by livability category from Very Low (red) to Very High (green)" caption="Final score distribution across all 7,842 buildings, shaded by category." size="full" >}}

## Validation Charts

{{< project-figure src="/assets/images/tallinn-validation" alt="Two bar charts: mean livability score by Tallinn district, and share of buildings that keep the same category when scoring assumptions change a little versus a lot" caption="Left: mean score by district. Right: result stability under the Monte Carlo sensitivity test." size="full" >}}

## Interactive Map

{{< embed-map src="/assets/tallinn-livability-map.html" title="Tallinn Apartment Livability Score — interactive map" height="640" >}}
