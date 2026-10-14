---
title: "European City Temperature Anomaly"
description: "How much warmer are Europe's large cities running vs their 1991–2020 baseline, computed cloud-natively from Overture Maps and the Copernicus ERA5 archive — no local data download."
intro: >
  113 European cities, 30 countries, 172 million people: a cloud-native
  temperature anomaly and population-exposure analysis built directly
  against Overture Maps and the Copernicus ERA5 archive in object storage,
  with no local data download.
date: 2026-07-30
image: "/assets/images/temperature-anomaly-map-2024"
tags: ["Climate Analysis", "Cloud-Native Geospatial", "DuckDB", "Python"]
featured: true
github_url: "https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/temperature-anomaly-europe"
live_url: ""
project_status: "Completed"
---

## The Question

- How much warmer were Europe's large cities in 2021–2024 than their 1991–2020 WMO baseline, and how many people live in them?
- Could this be computed cloud-natively — querying city locations and a 34-year reanalysis archive straight out of object storage — without downloading any of the underlying data locally?

## Approach

- Queried 330,261 Overture Maps localities with population directly from S3 GeoParquet with DuckDB, filtered to Europe and 500,000+ population, and dropped administrative units swallowed by a more populous neighbour — 113 cities across 30 countries
- Opened Planette's ERA5 `t2m_max` monthly store (1991–2024) lazily with Icechunk and XArray, computed a 1991–2020 monthly climatology, and extracted every city's anomaly in one vectorised nearest-grid-cell selection — no per-city loop, no local download
- Full pipeline and report: [code repository →](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/temperature-anomaly-europe)

## Methodology

- Anomalies follow the WMO/Copernicus convention: monthly means vs. a 1991–2020 monthly climatology, annual anomaly as the equal-weighted mean of the 12 monthly anomalies
- Recent period analysed: 2021–2024
- Exposure score: city population × anomaly, ranking which cities combine the largest temperature departure with the most people experiencing it
- Rendered an interactive per-city map — colour for anomaly magnitude, size for population, red border for the top 20% national anomaly percentile

## Validation

- Checked the 2024 Europe land-area anomaly against Copernicus's European State of the Climate 2024: +1.6°C here vs +1.47°C published, within ±0.3°C
- Checked Turkey's 2024 land anomaly against the Turkish State Meteorological Service: +1.7°C here vs +1.70°C published
- Checked the east–west spatial pattern: eastern Europe (20–40°E, 42–60°N) averaged +2.1°C over land in 2024 vs +1.0°C in the west (10°W–10°E, 42–60°N) — consistent with ESOTC 2024
- Sanity-checked baselines against WMO 1991–2020 station normals for five cities, which surfaced that the archive's `t2m_max` variable behaves like daily-mean temperature, not daily maximum

## Links

- [Read the climate analysis report (PDF) →](/assets/reports/European-City-Temperature-Anomaly-Report.pdf)
- [Explore the interactive city map (full screen) →](/assets/europe-temperature-anomaly-map.html)
- [Code & notebook (GitHub) →](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/temperature-anomaly-europe)

## Graphs

{{< project-carousel >}}
{{< carousel-item src="/assets/images/temperature-anomaly-map-2024" alt="Map of 2024 temperature anomaly vs 1991-2020 over European land cells, with east and west comparison boxes" name="2024 Anomaly Map (East vs West)" >}}
{{< carousel-item src="/assets/images/temperature-anomaly-distribution" alt="Histogram of city temperature anomalies and a boxplot of anomaly by country, sorted by median" name="Anomaly Distribution" >}}
{{< carousel-item src="/assets/images/temperature-anomaly-top-cities" alt="Scatter plot of city population vs temperature anomaly, with the ten most exposed cities labelled by population times anomaly" name="Most Exposed Cities" >}}
{{< carousel-item src="/assets/images/temperature-anomaly-validation" alt="Bar chart comparing this analysis's 2024 land-area anomaly for Europe and Turkey against published Copernicus and Turkish Met Service figures" name="Validation vs Published Data" >}}
{{< /project-carousel >}}

## Interactive Map

{{< embed-map src="/assets/europe-temperature-anomaly-map.html" title="European city temperature anomaly — interactive map" height="640" >}}
