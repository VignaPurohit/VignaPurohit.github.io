#!/usr/bin/env bash
# Reproject sea-ice concentration from south-polar stereographic
# (EPSG:3412) to geographic WGS84 (EPSG:4326) with GDAL.

gdalwarp -overwrite \
  -s_srs EPSG:3412 -t_srs EPSG:4326 \
  -te -180 -90 180 90 -tr 0.25 0.25 \
  S_201712_concentration_v3.0.tif sic_dec.tif
