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
github_url: "https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/antarctic-sea-ice-variability"
live_url: ""
project_status: "Completed"
---

## The Question

A persistent area of open water — a polynya — has repeatedly broken open above the Maud Rise seamount in the Weddell Sea since the 1970s, sometimes for months at a time. A polynya is open water held inside the ice pack by wind or ocean heat rather than by melting. What drives these events, and could a reproducible workflow identify, measure, and characterise one as it happened?

## Context

A research internship at the **National Centre for Polar and Ocean Research (NCPOR)**, Goa, during my M.Sc Geoinformatics. Objective: develop a processing methodology to study Antarctic sea-ice variability, centred on the Maud Rise seamount.

## Location

Maud Rise: 2.63°E, −65.23°S — rising from an abyssal plain of ~5,200 m to a shallowest depth of ~968 m.

## Methodology

- Mapped the polynya time-series across every available date, reprojecting sea-ice concentration from south-polar stereographic to GCS-WGS84 with GDAL
- Calculated polynya area per date in Python (pixel count at ≤15% sea-ice concentration × resolution)
- Computed daily/monthly climatological anomalies and extreme-value flags in CDO against a 1979–2016 baseline
- Analysed wind, mean sea-level pressure, and multi-sensor sea-ice drift around the polynya (ECMWF ERA-Interim)
- Processed surface heat flux, sea-surface temperature, and radiation (sensible/latent heat flux, net thermal and solar radiation)
- Mapped chlorophyll concentration and net primary production within the polynya (MODIS/VIIRS)
- Tracked ocean current, Absolute Dynamic Topography, windstress, and upwelling around the feature
- Plotted spatial outputs in GrADS and cross-correlated every parameter against the polynya's lifecycle

## Result

Delivered a reproducible, automated processing workflow — reprojection, anomaly and extreme-value detection, area calculation, and multi-parameter correlation — that reruns against new satellite passes to characterise any future Maud Rise polynya event without rebuilding the analysis from scratch.

## Links

- [Read the full internship report (PDF) →](/assets/reports/NCPOR-Antarctic-Sea-Ice-Internship-Report.pdf)
- [Automation code (CDO, GDAL, Python, GrADS) →](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/antarctic-sea-ice-variability)

## Parameter Plots

{{< project-carousel >}}
{{< carousel-item src="/assets/images/ncpor-sea-ice-extent" alt="Antarctic sea-ice extent maps for March and September, showing minimum and maximum annual coverage" name="Antarctic Sea-Ice Extent (Mar vs Sep)" >}}
{{< carousel-item src="/assets/images/ncpor-polynya-photo" alt="Aerial photograph of a polynya — a large area of dark open water surrounded by white sea ice floes" name="The Polynya" >}}
{{< carousel-item src="/assets/images/ncpor-sensible-heat-polynyas" alt="Map of Antarctic coastline showing sensible-heat polynya locations as lighter patches along the ice edge" name="Sensible-Heat Polynyas" >}}
{{< carousel-item src="/assets/images/ncpor-latent-heat-polynyas" alt="Sea-ice concentration map with two latent-heat coastal polynyas labelled and boxed, 9 October 2016" name="Latent-Heat Polynyas" >}}
{{< carousel-item src="/assets/images/ncpor-bathymetry" alt="Bathymetry map of the Maud Rise seamount, Eastern Weddell Sea, showing depth contours from the surface to -5999 m" name="Maud Rise Bathymetry" >}}
{{< carousel-item src="/assets/images/ncpor-reprojection" alt="Side-by-side comparison of sea-ice concentration in south-polar stereographic projection and reprojected to GCS-WGS84" name="Reprojection: Polar Stereographic to WGS84" >}}
{{< carousel-item src="/assets/images/ncpor-polynya-area-chart" alt="Chart of Maud Rise polynya area in square kilometres for the 1974, 1975, 1976, and 2017 events" name="Polynya Area, 1974–2017" >}}
{{< carousel-item src="/assets/images/ncpor-wind-pressure" alt="GrADS plot of atmospheric pressure contours, wind vectors, and sea-ice concentration over the Southern Ocean on 18 September 2017" name="Wind & Atmospheric Pressure" >}}
{{< carousel-item src="/assets/images/ncpor-heat-flux-anomaly" alt="Monthly maps of net heat flux anomaly over the Southern Ocean, August through December 2017" name="Net Heat Flux Anomaly" >}}
{{< carousel-item src="/assets/images/ncpor-extreme-values" alt="Monthly maps of extreme low and extreme high sea-ice concentration values, August through December 2017" name="Extreme Low & High SIC Values" >}}
{{< carousel-item src="/assets/images/ncpor-chlorophyll" alt="Aqua-MODIS chlorophyll-a concentration map over the Maud Rise polynya, 6 November 2017, in milligrams per cubic metre" name="Chlorophyll-a, 06-Nov-2017" >}}
{{< carousel-item src="/assets/images/ncpor-chlorophyll-log" alt="Time-series panels of log-scaled Aqua-MODIS chlorophyll-a concentration over the polynya region" name="Chlorophyll-a (Log Scale)" >}}
{{< carousel-item src="/assets/images/ncpor-primary-production" alt="Time-series panels of VGPM net primary production in milligrams of carbon per square metre per day" name="Net Primary Production (VGPM)" >}}
{{< carousel-item src="/assets/images/ncpor-sea-ice-drift" alt="Monthly panels of sea-ice drift vectors overlaid on SSM/I-SSMIS sea-ice concentration, September to December 2017" name="Sea-Ice Drift Vectors" >}}
{{< carousel-item src="/assets/images/ncpor-adt" alt="Monthly panels of Absolute Dynamic Topography around the Maud Rise polynya" name="Absolute Dynamic Topography" >}}
{{< carousel-item src="/assets/images/ncpor-sst" alt="MW+IR sea-surface temperature map over the Maud Rise polynya, 3 December 2017" name="Sea-Surface Temperature, 03-Dec-2017" >}}
{{< carousel-item src="/assets/images/ncpor-upwelling-windstress" alt="Monthly panels of upwelling and windstress over the polynya region, September to December 2017" name="Upwelling & Windstress" >}}
{{< carousel-item src="/assets/images/ncpor-ocean-current" alt="Monthly panels of subsurface ocean current and temperature anomaly below the sea ice, August to December 2017" name="Subsurface Ocean Current & Temperature" >}}
{{< carousel-item src="/assets/images/ncpor-graphs-analysis" alt="Twelve time-series panels plotting sea-ice concentration, pressure, SST, wind, heat flux, moisture flux, and the SAM index against each other" name="Multi-Parameter Time Series" >}}
{{< carousel-item src="/assets/images/ncpor-sea-ice-climatology" alt="Monthly sea-ice concentration climatology maps over the Maud Rise seamount, August through December" name="Sea-Ice Climatology" >}}
{{< /project-carousel >}}
