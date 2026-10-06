---
title: "Interactive GeoNames Map"
description: "An interactive Folium map built on GeoNames data, queried and aggregated with DuckDB for a fast, dependency-light spatial data pipeline."
date: 2026-05-05
image: "/assets/images/gallery/workshop-01"
image_alt: "Presenting the interactiveMap_geonames.ipynb notebook on screen at a FOSS4G Asia workshop"
tags: ["DuckDB", "Folium", "GeoNames", "Python"]
featured: false
github_url: ""
live_url: ""
project_status: "Completed"
---

## The Question

GeoNames publishes city-level data for the entire world — can it be queried, aggregated, and turned into an interactive map without standing up a database server, just a notebook and a Parquet file?

## Data

A GeoNames-derived Parquet dataset of global cities, including population figures, queried directly with SQL.

## Approach

DuckDB does the aggregation work directly against the GeoNames table, for example:

```sql
SELECT country_code, COUNT(*) AS city_count, SUM(population) AS total_population
FROM read_parquet('geonames_parquet')
GROUP BY country_code
ORDER BY total_population DESC
```

The aggregated results feed a **Folium** map for interactive exploration — pan, zoom, and inspect city/country-level population figures in the browser rather than in a static table.

## Outcome / Impact

This notebook has been used as workshop teaching material at **Spatial Thoughts**, demonstrating a fast, dependency-light spatial data pipeline (DuckDB + Folium, no server required) to training participants — including at FOSS4G Asia.

## Technical Details

DuckDB, GeoNames, Folium, branca, Python.

## Links

- [Download the notebook (.ipynb) →](/assets/notebooks/interactiveMap_geonames.ipynb)
