* GrADS script: overlay mean sea-level pressure contours and wind
* vectors on a sea-ice concentration anomaly field, with a sea-ice
* extent outline and the Antarctic coastline shapefile.

'sdfopen anomaly.nc'
'set grads off'
'set ylopts 1 3 0.14'
'set xlopts 1 3 0.14'
'set t 2'
'run ci_rgb.gs'
'q pos'

'set gxout contour'
'set cint 2'
'set ccolor 0'
'set clab forced'
'set clopts -1 -1 0.14'
'd msl_hpa'

'set ccolor 4'
'set arrscl 0.4 5'
'd skip(u10,8);skip(v10,8)'

'sdfopen sept_hash.nc'
'set dfile 2'
'set t 1'

'set gxout contour'
'set clab off'
'set ccolor 2'
'd ci'

'set gxout contour'
'set clab off'
'set ccolor 15'
'd msl'

'set t 2'
'set gxout contour'
'set clab off'
'set ccolor 15'
'd msl'

'set line 0'
'set shpopts 15'
'draw shp ATA_adm0.shp'
