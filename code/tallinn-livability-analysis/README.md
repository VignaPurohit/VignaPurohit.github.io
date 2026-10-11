# Tallinn Apartment Livability Score

A network-distance livability score for every apartment building in Tallinn,
Estonia, built end-to-end with an AI coding agent (Claude Code) steering
data ingestion, routing, scoring, and validation.

Full write-up: [vignapurohit.github.io/projects/tallinn-livability-analysis](https://vignapurohit.github.io/projects/tallinn-livability-analysis/)
Methodology summary (PDF): [tallinn_livability_methodology.pdf](../../static/assets/reports/Tallinn-Livability-Methodology.pdf)

## Pipeline

1. **[`01_data_prep_tallinn.ipynb`](01_data_prep_tallinn.ipynb)** — load apartment
   buildings (ETAK building footprints joined to EHR energy-class data via
   Maa- ja Ruumiamet's `etak_ehr_hooned` service), clip to the Tallinn AOI,
   and combine ETAK green/blue space polygons.
2. **[`tallinn_amenities.py`](tallinn_amenities.py)** — pull transit stops from
   the Estonian Public Transport Register (GTFS) and grocery/gym locations
   from OpenStreetMap via the Overpass API.
3. **[`02_building_quality_score.ipynb`](02_building_quality_score.ipynb)** —
   an energy-class/building-quality score, evaluated as a possible fifth
   factor and kept as reference only (see "Why energy class isn't scored"
   below).
4. **[`03_proximity_final_score.ipynb`](03_proximity_final_score.ipynb)** —
   the core of the pipeline: build the OSM walking network, snap buildings
   and amenities to it, run multi-source Dijkstra routing to the nearest
   transit stop / grocery / gym / green-blue space, apply distance decay,
   normalize each factor to 0–100, and combine them with a geometric mean /
   Mazziotta-Pareto aggregation (a poor result on one factor can't be fully
   offset by strong results on the others). Buildings are then split into
   five data-driven livability categories (Natural Breaks) and rendered to
   an interactive Folium/Leaflet map.
5. **[`04_validation.ipynb`](04_validation.ipynb)** — outlier audit, a
   spatial sanity pass against district-level expectations, and a 300-run
   Monte Carlo sensitivity analysis of the scoring assumptions.
6. **[`05_generate_report.py`](05_generate_report.py)** — renders the charts
   and the PDF methodology summary from the final scored dataset.

## Methodology

- Snapped every building and amenity to the real pedestrian street network, not straight-line distance
- Ran multi-source Dijkstra routing to find the network-shortest distance from each building to its nearest transit stop, grocery store, gym, and green/blue space
- Applied distance decay so a location exactly at a factor's typical walking threshold scores halfway, rather than a hard cutoff
- Normalized each of the four proximity factors to a common 0–100 scale
- Combined them with a geometric mean / Mazziotta-Pareto aggregation, so one very poor factor can't be fully offset by strong scores elsewhere
- Classified buildings into five data-driven livability categories with Natural Breaks
- Evaluated building energy class as a possible fifth factor, then excluded it (see below)

## Result

7,842 Tallinn apartment buildings scored across four equally-weighted proximity factors into five livability categories, validated against local knowledge and assumption sensitivity, and published as a searchable interactive map.

## Why energy class isn't scored

Estonia's building energy certificate (A–H) and renovation history were
both evaluated as scoring factors. Neither made it into the final score:
only about half of buildings have a certificate on file, and no reliable
renovation date exists for any building. Energy class is still shown on
the interactive map for reference — it just doesn't affect the score.

## Data sources

| Source | Provides | Count in Tallinn |
|---|---|---|
| ETAK (Estonian Topographic Database) | Building footprints | 7,842 apartment buildings |
| EHR (Estonian Building Register) | Energy class, address | 3,807 with energy data |
| ETAK | Green/blue space polygons | 3,128 polygons |
| OpenStreetMap | Street network for walking routes | 277,733 nodes |
| Ühistranspordiregister (GTFS) | Transit stops | 1,319 stops |
| OpenStreetMap (Overpass) | Grocery stores / gyms | 236 / 56 |

Buildings are limited to apartment buildings with 3+ units, clipped to the
Tallinn city boundary.

## Tools

Python, GeoPandas, OSMnx/NetworkX (routing), mapclassify (Natural Breaks),
SciPy, Folium/Leaflet (interactive map), FPDF (report generation). See
[`environment.yml`](environment.yml) for the full conda environment.

---

This folder lives inside the [portfolio site repo](https://github.com/VignaPurohit/VignaPurohit.github.io/tree/main/code/tallinn-livability-analysis) — it isn't part of the Hugo build.
