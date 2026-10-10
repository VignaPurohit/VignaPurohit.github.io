"""
Calculate polynya area from a directory of sea-ice concentration
GeoTIFF subsets: count pixels at or above the concentration threshold
that marks open water inside the ice pack, and convert the pixel
count to an area using the raster's cell size.
"""
import os

from osgeo import gdal
from gdalconst import GA_ReadOnly

indir = "/home/vigna/Documents/polynyas/SIC/1972-77/polynya_74_75_76/1975"
directory = os.fsencode(indir)

PIXEL_SIZE_KM = 25  # raster cell size, km
CONCENTRATION_THRESHOLD = 200  # scaled sea-ice concentration value

index = 1
for entry in os.listdir(directory):
    filename = os.fsdecode(entry)
    if "_subset.tif" not in filename:
        continue

    name = f"{index}_subset.tif"
    dataset = gdal.Open(os.path.join(indir, name), GA_ReadOnly)
    band = dataset.GetRasterBand(1)
    array = band.ReadAsArray()

    open_water_pixels = array[array >= CONCENTRATION_THRESHOLD]
    pixel_count = len(open_water_pixels)
    area_km2 = pixel_count * PIXEL_SIZE_KM * PIXEL_SIZE_KM

    print(f"{name}: {area_km2} km^2")
    index += 1
