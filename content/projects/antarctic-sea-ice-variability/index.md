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

## What a Polynya Looks Like

{{< project-figure src="/assets/images/ncpor-polynya-photo" alt="Aerial photograph of a polynya — a large area of dark open water surrounded by white sea ice floes" caption="A polynya: persistent open water inside the ice pack, held open by wind or ocean heat rather than by melting." size="small" >}}

## Context

A research internship at the **National Centre for Polar and Ocean Research (NCPOR)**, Goa, during my M.Sc Geoinformatics. Objective: develop a processing methodology to study Antarctic sea-ice variability, centred on the Maud Rise seamount.

## Location

{{< project-figure src="/assets/images/ncpor-bathymetry" alt="Bathymetry map of the Maud Rise seamount, Eastern Weddell Sea, showing depth contours from the surface to -5999 m" caption="Maud Rise: 2.63°E, −65.23°S — rising from an abyssal plain of ~5,200 m to a shallowest depth of ~968 m." size="small" >}}

## Methodology

- Mapped the polynya time-series across every available date, reprojecting sea-ice concentration from south-polar stereographic to GCS-WGS84 with GDAL
- Calculated polynya area per date in Python (pixel count at ≤15% sea-ice concentration × resolution)
- Computed daily/monthly climatological anomalies and extreme-value flags in CDO against a 1979–2016 baseline
- Analysed wind, mean sea-level pressure, and multi-sensor sea-ice drift around the polynya (ECMWF ERA-Interim)
- Processed surface heat flux, sea-surface temperature, and radiation (sensible/latent heat flux, net thermal and solar radiation)
- Mapped chlorophyll concentration and net primary production within the polynya (MODIS/VIIRS)
- Tracked ocean current, Absolute Dynamic Topography, windstress, and upwelling around the feature
- Plotted spatial outputs in GrADS and cross-correlated every parameter against the polynya's lifecycle

## Winds &amp; Atmospheric Pressure

{{< project-figure src="/assets/images/ncpor-wind-pressure" alt="GrADS plot of atmospheric pressure contours, wind vectors, and sea-ice concentration over the Southern Ocean on 18 September 2017" caption="Atmospheric pressure, wind, and sea-ice concentration on 18 September 2017 — wind is what first holds a latent-heat polynya open." size="small" >}}

## Chlorophyll in the Polynya

{{< project-figure src="/assets/images/ncpor-chlorophyll" alt="Aqua-MODIS chlorophyll-a concentration map over the Maud Rise polynya, in milligrams per cubic metre" caption="Aqua-MODIS chlorophyll-a (mg/m³) — open water inside the polynya lets light reach the surface, triggering a bloom." size="small" >}}

## Key Finding

{{< project-figure src="/assets/images/ncpor-polynya-area-chart" alt="Bar chart of Maud Rise polynya area in square kilometres for the 1974, 1975, 1976, and 2017 events, with trend arrows" caption="Polynya area across every significant Maud Rise event identified, 1974–2017." size="small" >}}

## Result

Delivered a reproducible, automated processing workflow — reprojection, anomaly and extreme-value detection, area calculation, and multi-parameter correlation — that reruns against new satellite passes to characterise any future Maud Rise polynya event without rebuilding the analysis from scratch.

## Technical Details

Python (NumPy, GDAL/OGR), CDO, GrADS, QGIS, Ocean Data View (ODV), SigmaPlot; NSIDC sea-ice concentration, ECMWF ERA-Interim, MODIS/VIIRS, multi-sensor sea-ice drift, multi-mission satellite altimetry, NOAA CoastWatch, and ORAS4 reanalysis data products.

## Links

- [Read the full internship report (PDF) →](/assets/reports/NCPOR-Antarctic-Sea-Ice-Internship-Report.pdf)
- [See this internship in Education →](/education/)
