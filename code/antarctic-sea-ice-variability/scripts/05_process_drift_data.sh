#!/usr/bin/env bash
# Process monthly sea-ice drift NetCDF into reprojected GeoTIFF/NetCDF
# components (lat/lon/displacement), with GDAL.

# cdo splitmon drift_monthly.nc mon

for ((i=10; i<=12; i++)); do
  gdal_translate -of VRT NETCDF:"mon${i}.nc":lat  "${i}_lat.vrt"
  gdal_translate -of VRT NETCDF:"mon${i}.nc":lon  "${i}_lon.vrt"
  gdal_translate -of VRT NETCDF:"mon${i}.nc":lat1 "${i}_lat1.vrt"
  gdal_translate -of VRT NETCDF:"mon${i}.nc":lon1 "${i}_lon1.vrt"
  gdal_translate -of VRT NETCDF:"mon${i}.nc":dX   "${i}_dx.vrt"
  gdal_translate -of VRT NETCDF:"mon${i}.nc":dY   "${i}_dy.vrt"

  gdalwarp -geoloc -t_srs EPSG:3412 "${i}_dx.vrt" "${i}_dx.tif"
  gdalwarp -geoloc -t_srs EPSG:3412 "${i}_dy.vrt" "${i}_dy.tif"

  gdalwarp -overwrite -s_srs EPSG:3412 -t_srs EPSG:4326 \
    -te -180 -90 180 90 -tr 0.25 0.25 "${i}_dx.tif" "${i}_dx_reproject.tif"
  gdalwarp -overwrite -s_srs EPSG:3412 -t_srs EPSG:4326 \
    -te -180 -90 180 90 -tr 0.25 0.25 "${i}_dy.tif" "${i}_dy_reproject.tif"

  gdal_translate -of netcdf "${i}_dx_reproject.tif" "${i}_dx.nc"
  gdal_translate -of netcdf "${i}_dy_reproject.tif" "${i}_dy.nc"

  cdo merge "${i}_dx.nc" "${i}_dy.nc" "${i}_dx_dy.nc"
done
