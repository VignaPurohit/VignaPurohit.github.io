---
title: "Antarctic Sea Ice Variability: A Processing Methodology"
description: "Identifying and characterising the Maud Rise polynya using a multi-parameter remote sensing and reanalysis workflow spanning sea ice, atmosphere, ocean, and ocean colour."
intro: >
  Identifying and characterising the Maud Rise polynya using a multi-parameter
  remote sensing and reanalysis workflow spanning sea ice, atmosphere, ocean,
  and ocean colour. A research internship at the National Centre for Polar
  and Ocean Research (NCPOR), Goa, during my M.Sc Geoinformatics.
date: 2018-07-01
image: ""
tags: ["Remote Sensing", "Antarctic Sea Ice", "Polynya Dynamics", "NCPOR"]
featured: false
github_url: ""
live_url: ""
project_status: "Completed"
---

## The Question

A persistent area of open water — a polynya — has repeatedly broken open above the Maud Rise seamount in the Weddell Sea since the 1970s, sometimes for months at a time. What drives these events, and could a reproducible workflow identify, measure, and characterise one as it happened?

## Context

A research internship at the **National Centre for Polar and Ocean Research (NCPOR)**, Goa, during my M.Sc Geoinformatics. Objective: develop a processing methodology to study Antarctic sea-ice variability, centred on the Maud Rise seamount.

## Location

{{< project-figure src="/assets/images/ncpor-bathymetry" alt="Bathymetry map of the Maud Rise seamount, Eastern Weddell Sea, showing depth contours from the surface to -5999 m" caption="Maud Rise: 2.63°E, −65.23°S — rising from an abyssal plain of ~5,200 m to a shallowest depth of ~968 m." size="small" >}}

## Data

Eleven task-based datasets: NSIDC sea-ice concentration; ECMWF ERA-Interim wind, pressure, SST, and heat fluxes; MODIS/VIIRS chlorophyll and net primary production; multi-sensor sea-ice drift; multi-mission Absolute Dynamic Topography; MW+IR sea-surface temperature; NOAA CoastWatch windstress and upwelling; and ORAS4 ocean current, temperature, and salinity.

## Approach

Reprojected sea-ice concentration from south-polar stereographic to GCS-WGS84 with GDAL; calculated polynya area per date in Python (pixel count at ≤15% concentration × resolution); computed daily/monthly anomalies and extreme-value flags in CDO against a 1979–2016 baseline; plotted in GrADS; and cross-correlated every parameter against the polynya's lifecycle.

## Key Finding

{{< project-figure src="/assets/images/ncpor-polynya-area-chart" alt="Bar chart of Maud Rise polynya area in square kilometres for the 1974, 1975, 1976, and 2017 events, with trend arrows" caption="Polynya area across every significant Maud Rise event identified, 1974–2017." size="small" >}}

## Results

Mapped every significant event back to 1974 (0.23M km²), 1975 (0.38M km²), and 1976 (0.17M km², expanding to ~4.1M km²) — each formed by wind suppressing new ice growth. After an 18-year gap, small events appeared in 1994 and 2016 via melting of pre-existing ice. The 2017 event opened on 10 June at 43,125 km², sustained nine days, and broke down in December under a southward intrusion of warmer water — delivering a methodology reusable for any future Maud Rise polynya.

## Technical Details

Python (NumPy, GDAL/OGR), CDO, GrADS, QGIS, Ocean Data View (ODV), SigmaPlot; NSIDC, ECMWF ERA-Interim, MODIS/VIIRS, multi-sensor sea-ice drift, multi-mission altimetry, NOAA CoastWatch, and ORAS4 data products.

## Links

- [Read the full internship report (PDF) →](/assets/reports/NCPOR-Antarctic-Sea-Ice-Internship-Report.pdf)
- [See this internship in Education →](/education/)
