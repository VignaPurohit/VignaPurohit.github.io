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

- Which apartment buildings in Tallinn are genuinely livable — based on real walkable access to transit, groceries, gyms, and green or blue space, not straight-line distance on a map?
- Could a full spatial-data pipeline — ingestion, network routing, scoring, validation, and an interactive map — be built and shipped by one person directing an AI coding agent, instead of a team hand-writing every line?
- Full data sources and scoring methodology: [methodology summary (PDF) →](/assets/reports/Tallinn-Livability-Methodology.pdf)

## Approach: Agentic Coding

- The entire pipeline — four analysis notebooks plus a report generator — was built by directing **Claude Code** end-to-end
- Reading Estonia's open-data registries, tracing a dead GTFS feed URL to its replacement, writing the network-routing and scoring logic, and generating the validation charts and PDF report
- My role: steer scope, choose the scoring methodology, review the agent's code and results at each stage, and decide what to cut
- Dropped a data source (building energy class) once validation showed it wasn't reliable enough to score on, rather than writing the geospatial code by hand
- Notebooks and the methodology write-up: [code repository →](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/tallinn-livability-analysis)

## Validation

- Manually reviewed the highest- and lowest-scoring buildings, catching a real bug: ~2% of buildings were scoring as if they had no nearby amenities at all, from a gap in the street network — fixed, every building now routes correctly
- Checked district-level averages against local knowledge: well-connected Lasnamäe and Põhja-Tallinna score highest, quieter Pirita lowest
- Ran a 300-iteration Monte Carlo sensitivity test on the scoring assumptions: small, reasonable changes barely move results (86% of buildings keep their category); large, unrealistic changes move them a lot, as expected

## Links

- [Read the methodology summary (PDF) →](/assets/reports/Tallinn-Livability-Methodology.pdf)
- [Open the interactive map (full screen) →](/assets/tallinn-livability-map.html)
- [Code & notebooks (GitHub) →](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/tallinn-livability-analysis)

## Graphs

{{< project-carousel >}}
{{< carousel-item src="/assets/images/tallinn-score-distribution" alt="Histogram of final livability scores from 0 to 100, shaded by livability category from Very Low (red) to Very High (green)" name="Score Distribution" >}}
{{< carousel-item src="/assets/images/tallinn-validation" alt="Two bar charts: mean livability score by Tallinn district, and share of buildings that keep the same category when scoring assumptions change a little versus a lot" name="Validation Charts" >}}
{{< /project-carousel >}}

## Interactive Map

{{< embed-map src="/assets/tallinn-livability-map.html" title="Tallinn Apartment Livability Score — interactive map" height="640" >}}
