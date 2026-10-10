# Antarctic Sea-Ice Polynya Processing Pipeline

Processing methodology developed during a research internship at the
**National Centre for Polar and Ocean Research (NCPOR)**, Goa, to identify,
measure, and characterise the Maud Rise polynya — a persistent area of open
water that has repeatedly broken open above the Maud Rise seamount in the
Weddell Sea since the 1970s.

Full write-up: [vignapurohit.github.io/projects/antarctic-sea-ice-variability](https://vignapurohit.github.io/projects/antarctic-sea-ice-variability/)

## Workflow

1. **Reproject** sea-ice concentration from south-polar stereographic
   (EPSG:3412) to geographic WGS84 (EPSG:4326) — [`03_reproject_sea_ice.sh`](scripts/03_reproject_sea_ice.sh)
2. **Calculate polynya area** per date from the reprojected concentration
   raster (pixel count at the open-water threshold × cell area) — [`04_calculate_polynya_area.py`](scripts/04_calculate_polynya_area.py)
3. **Compute anomalies** — daily and monthly climatological anomalies
   against a 1979–2016 baseline — [`01_daily_monthly_anomaly.sh`](scripts/01_daily_monthly_anomaly.sh)
4. **Flag extreme values** — daily values outside the historical
   min/max envelope — [`02_extreme_values.sh`](scripts/02_extreme_values.sh)
5. **Process sea-ice drift** vectors into reprojected GeoTIFF/NetCDF
   components — [`05_process_drift_data.sh`](scripts/05_process_drift_data.sh)
6. **Plot** pressure contours, wind vectors, and sea-ice concentration
   anomaly together in GrADS — [`06_plot_grads.gs`](scripts/06_plot_grads.gs)

Atmospheric (wind, pressure, heat flux, radiation), ocean (current, ADT,
upwelling, windstress, SST), and ocean-colour (chlorophyll, net primary
production) parameters were processed the same way and cross-correlated
against the polynya's lifecycle in SigmaPlot.

## Tools

Python (NumPy, GDAL/OGR), CDO, GrADS, QGIS, Ocean Data View (ODV), SigmaPlot.

## Data sources

NSIDC sea-ice concentration, ECMWF ERA-Interim, MODIS/VIIRS, multi-sensor
sea-ice drift, multi-mission satellite altimetry, NOAA CoastWatch, and
ORAS4 reanalysis.

---

Extracted from the internship report's "Tools and codes" section. File
paths and variable names are kept as originally written; adapt them to
your own data layout before running.

This folder lives inside the [portfolio site repo](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/antarctic-sea-ice-variability) — it isn't part of the Hugo build.
