---
title: "Geospatial Analysis with DuckDB"
description: "Spatial SQL over cloud-hosted GeoParquet files — joining Asian cities to state boundaries with ST_Within, then rendering a choropleth of city counts with proportional population symbols."
date: 2026-05-05
image: ""
tags: ["DuckDB", "GeoParquet", "Python", "Spatial SQL"]
featured: true
github_url: ""
live_url: ""
project_status: "Completed"
---

## The Question

Can a single, dependency-light SQL engine — no PostGIS server, no cloud warehouse — join and aggregate real geospatial data straight out of cloud storage, fast enough for exploratory analysis?

## Data

Two cloud-hosted GeoParquet files read directly over HTTPS: a GeoNames-derived table of Asian cities (with population and average temperature), and a table of Asian state/province boundaries.

## Approach

Using **DuckDB** with its `spatial` extension loaded, the cities and states tables are read in place with `read_parquet()` — no local download or import step — and joined with a spatial predicate:

```sql
SELECT s.country_name, s.state_name, COUNT(c.*) AS city_count, s.geometry
FROM states s
LEFT JOIN cities c ON ST_Within(c.geom, s.geometry)
GROUP BY s.country_name, s.state_name, s.geometry
```

The resulting state-level city counts and the city-level points are each brought into GeoPandas via `ST_AsText()` / WKT, and a marker size is derived from population (`sqrt(population) / 40`) for proportional symbology.

## Results

A single Matplotlib figure layering two views of the same join: a choropleth of **states shaded by number of cities over 1M population**, with the underlying **cities plotted as proportional symbols** sized by population on top — turning one spatial SQL query directly into a publication-ready static map.

## Technical Details

DuckDB + the `spatial` extension, GeoParquet, GeoPandas, Shapely, Matplotlib, Folium. The full workflow — install, load extension, spatial join, GeoPandas conversion, plotting — lives in the notebook linked below.

## Links

- [Download the notebook (.ipynb) →](/assets/notebooks/DuckDB_Geospatial.ipynb)
