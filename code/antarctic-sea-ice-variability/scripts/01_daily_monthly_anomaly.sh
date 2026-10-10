#!/usr/bin/env bash
# Daily/monthly climatological anomaly of sea-ice concentration (or any
# gridded parameter), computed in CDO against a 1979-2016 baseline.

# --- Daily mean, per season-month, for each year in the baseline ---
for ((i=10; i<=17; i++)); do
  cdo ydaymean "${i}_aug.nc"  "${i}_aug_mean.nc"
  cdo ydaymean "${i}_sept.nc" "${i}_sept_mean.nc"
  cdo ydaymean "${i}_oct.nc"  "${i}_oct_mean.nc"
  cdo ydaymean "${i}_nov.nc"  "${i}_nov_mean.nc"
  cdo ydaymean "${i}_dec.nc"  "${i}_dec_mean.nc"
done

# --- Daily anomaly: target year vs. 1979-2016 daily climatology ---
cdo -b 64 mergetime *.nc 79_15.nc
cdo ydaymean 79_15.nc climatology.nc

cdo -b 64 mergetime 17_*.nc 2017.nc
# Note: trim to the baseline's 153 timesteps before differencing -
# delete the extra step, then rename the 153-step output back to 2017.nc
cdo delete,timestep=122 2017.nc del.nc
cdo sub 2017.nc climatology.nc anomaly.nc

# --- Monthly anomaly: target year vs. 1979-2016 monthly climatology ---
cdo ymonmean 79_15.nc climatology.nc
cdo -b 64 sub 17.nc climatology.nc anomaly.nc
