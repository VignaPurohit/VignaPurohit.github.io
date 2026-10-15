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
github_url: "https://github.com/VignaPurohit/europe-climate-anomaly"
live_url: ""
project_status: "Completed"
---

## The Question

- How much warmer were **Europe's 113 largest cities** in **2021–2024** than their **1991–2020** climate normal, and **how many people** live in them?
- Can it be done **fully cloud-native**: streaming a 34-year climate archive and global map data straight from object storage, with **no local downloads**?

## Approach

- **Cities:** queried **330,261 localities** from Overture Maps (GeoParquet on S3) with **DuckDB**. Kept cities of **500,000+** people and removed duplicates and districts, leaving **113 cities in 30 countries**.
- **Climate:** streamed **ERA5 reanalysis** (1991–2024) from Planette's Zarr/Icechunk archive with **xarray**, and extracted all cities in **one vectorised step**, with no per-city loop.
- **Performance:** the full climate computation runs in about **30 seconds**, thanks to a monthly data store and caching.

## Methodology

- **Method:** standard **WMO/Copernicus anomaly convention**. Monthly means are compared with a 1991–2020 monthly climatology, and the annual anomaly is the **equal-weighted mean of 12 months**.

## Results & Validation

- **Every one of the 113 cities warmed.** The average was **+1.0 °C** above the 1991–2020 normal, from **+0.3 °C (Oslo)** to **+1.6 °C (Bucharest)**.
- **62 cities, home to 79 million people,** ran at least **+1.0 °C** warmer.
- **Warming is strongest in the east and south-east, and weakest on the Atlantic and Nordic fringe.** In 2024, eastern Europe ran **+2.1 °C** against **+1.0 °C** in the west.
- **The results match published figures:** Europe 2024 **+1.6 °C** vs **+1.47 °C** (Copernicus); Turkey 2024 **+1.7 °C** vs **+1.70 °C** (Turkish State Meteorological Service).
- **Validation caught a data issue:** the archive's "daily maximum" turned out to behave like **daily-mean temperature**, so results are labelled accordingly. <strong><a href="/assets/reports/European-City-Temperature-Anomaly-Report.pdf" target="_blank" rel="noopener noreferrer">Full checks in the report →</a></strong>

## Graphs

{{< project-carousel >}}
{{< carousel-item src="/assets/images/temperature-anomaly-map-2024" alt="Map of 2024 temperature anomaly vs 1991-2020 over European land cells, with east and west comparison boxes" name="2024 vs 1991–2020: eastern Europe ran about +2 °C, the Atlantic west about +1 °C." >}}
{{< carousel-item src="/assets/images/temperature-anomaly-distribution" alt="Histogram of city temperature anomalies and a boxplot of anomaly by country, sorted by median" name="City warming by country, 2021–2024: from +1.6 °C (Romania) to +0.3 °C (Norway)." >}}
{{< carousel-item src="/assets/images/temperature-anomaly-top-cities" alt="Scatter plot of city population vs temperature anomaly, with the ten most exposed cities labelled by population times anomaly" name="Exposure is driven by city size: Istanbul, Moscow and London top the list despite average anomalies." >}}
{{< carousel-item src="/assets/images/temperature-anomaly-validation" alt="Bar chart comparing this analysis's 2024 land-area anomaly for Europe and Turkey against published Copernicus and Turkish Met Service figures" name="The results match published figures: +1.6 °C vs +1.47 °C for Europe, +1.7 °C vs +1.70 °C for Turkey (2024)." >}}
{{< /project-carousel >}}

## Links

- <strong><a href="/assets/reports/European-City-Temperature-Anomaly-Report.pdf" target="_blank" rel="noopener noreferrer">Read the report (PDF) →</a></strong>
- <strong><a href="/assets/europe-temperature-anomaly-map.html" target="_blank" rel="noopener noreferrer">Explore the interactive city map →</a></strong>
- <strong><a href="https://github.com/VignaPurohit/europe-climate-anomaly" target="_blank" rel="noopener noreferrer">Code & notebook (GitHub) →</a></strong>

## Interactive Map

{{< embed-map src="/assets/europe-temperature-anomaly-map.html" title="European city temperature anomaly — interactive map" height="640" >}}
