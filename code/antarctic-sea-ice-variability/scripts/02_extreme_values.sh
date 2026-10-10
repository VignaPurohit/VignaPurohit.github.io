#!/usr/bin/env bash
# Flag extreme minimum/maximum ("hash") values against a 1979-2016
# running baseline, per parameter, in CDO.

cdo runmax,38 oct_79_16_ci.nc oct_max_79_16_ci.nc
cdo -b 64 -gt aug_17_sst.nc aug_max_79_16_sst.nc aug_17_sst_hashmax.nc

cdo shifttime,1days oct_17_ci_hashmax.nc max_17_ci.nc
cdo cat oct_17_ci_hashmin.nc max_17_ci.nc oct_ci_hash.nc
