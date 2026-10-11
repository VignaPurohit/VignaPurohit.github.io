"""
Pulls two Tallinn livability datasets:
  1. Bus/tram/trolleybus stops - from the Estonian Public Transport Register (GTFS)
  2. Gyms + grocery stores      - from OpenStreetMap via the Overpass API

Requires: pip install requests

Both sources are free/public, no API key or login needed.
"""

import csv
import io
import json
import zipfile

import requests

# Rough bounding box around Tallinn (south, west, north, east).
# Good enough to filter out the rest of Estonia; tighten it later if needed.
TALLINN_BBOX = {
    "south": 59.35,
    "west": 24.55,
    "north": 59.50,
    "east": 24.95,
}


# ---------------------------------------------------------------------------
# 1. BUS/TRAM/TROLLEYBUS STOPS (GTFS)
# ---------------------------------------------------------------------------
GTFS_URLS = [
    # As of Aug 2026, the old peatus.ee/gtfs/gtfs.zip link is dead (moved
    # without a redirect). The Estonian transit community traced the new
    # unified feed here:
    "https://eu-gtfs.remix.com/estonia_unified_gtfs.zip",
    # Kept as a fallback in case the old path comes back or redirects:
    "https://peatus.ee/gtfs/gtfs.zip",
]


def download_bus_stops():
    resp = None
    for url in GTFS_URLS:
        print(f"Trying GTFS feed: {url} ...")
        try:
            r = requests.get(url, timeout=60)
            r.raise_for_status()
            # Quick sanity check: a real zip starts with 'PK'
            if r.content[:2] == b"PK":
                resp = r
                print(f"  -> OK, got a valid zip from {url}\n")
                break
            else:
                print(f"  -> Not a zip file (probably moved/redirected), trying next...\n")
        except requests.RequestException as e:
            print(f"  -> Failed: {e}\n")

    if resp is None:
        raise RuntimeError(
            "Could not download the GTFS feed from any known URL. "
            "Check https://www.regionaalministeerium.ee for the current "
            "'Ühistranspordiregistri avaandmed' link and update GTFS_URLS."
        )

    stops = []
    with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
        with z.open("stops.txt") as f:
            reader = csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig"))
            for row in reader:
                try:
                    lat = float(row["stop_lat"])
                    lon = float(row["stop_lon"])
                except (KeyError, ValueError):
                    continue
                if (
                    TALLINN_BBOX["south"] <= lat <= TALLINN_BBOX["north"]
                    and TALLINN_BBOX["west"] <= lon <= TALLINN_BBOX["east"]
                ):
                    stops.append(
                        {
                            "stop_id": row.get("stop_id"),
                            "stop_name": row.get("stop_name"),
                            "lat": lat,
                            "lon": lon,
                        }
                    )

    print(f"Found {len(stops)} stops within the Tallinn bounding box.")
    with open("tallinn_bus_stops.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["stop_id", "stop_name", "lat", "lon"])
        writer.writeheader()
        writer.writerows(stops)
    print("Saved -> tallinn_bus_stops.csv\n")
    return stops


# ---------------------------------------------------------------------------
# 2. GYMS + GROCERY STORES (OpenStreetMap Overpass API)
# ---------------------------------------------------------------------------
OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
]

OVERPASS_QUERY = """
[out:json][timeout:60];
(
  node["leisure"="fitness_centre"]({south},{west},{north},{east});
  way["leisure"="fitness_centre"]({south},{west},{north},{east});
  node["shop"="supermarket"]({south},{west},{north},{east});
  way["shop"="supermarket"]({south},{west},{north},{east});
  node["shop"="convenience"]({south},{west},{north},{east});
  way["shop"="convenience"]({south},{west},{north},{east});
  node["shop"="grocery"]({south},{west},{north},{east});
  way["shop"="grocery"]({south},{west},{north},{east});
);
out center tags;
""".format(**TALLINN_BBOX)


OVERPASS_QUERY_GYMS = """
[out:json][timeout:60];
(
  node["leisure"="fitness_centre"]({south},{west},{north},{east});
  way["leisure"="fitness_centre"]({south},{west},{north},{east});
);
out center tags;
""".format(**TALLINN_BBOX)

OVERPASS_QUERY_GROCERIES = """
[out:json][timeout:60];
(
  node["shop"="supermarket"]({south},{west},{north},{east});
  way["shop"="supermarket"]({south},{west},{north},{east});
  node["shop"="convenience"]({south},{west},{north},{east});
  way["shop"="convenience"]({south},{west},{north},{east});
  node["shop"="grocery"]({south},{west},{north},{east});
  way["shop"="grocery"]({south},{west},{north},{east});
);
out center tags;
""".format(**TALLINN_BBOX)


def _query_overpass(query, label):
    headers = {
        "User-Agent": "tallinn-livability-score/1.0 (personal research project)",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    for url in OVERPASS_URLS:
        print(f"[{label}] Trying {url} ...")
        try:
            r = requests.post(url, data={"data": query}, headers=headers, timeout=90)
            r.raise_for_status()
            print(f"[{label}] -> OK\n")
            return r.json()
        except requests.RequestException as e:
            print(f"[{label}] -> Failed: {type(e).__name__}: {e}\n")
    raise RuntimeError(f"Could not reach any Overpass mirror for {label}.")


def _elements_to_rows(elements, category):
    rows = []
    for el in elements:
        tags = el.get("tags", {})
        if el["type"] == "node":
            lat, lon = el.get("lat"), el.get("lon")
        else:
            center = el.get("center", {})
            lat, lon = center.get("lat"), center.get("lon")
        rows.append(
            {
                "category": category,
                "name": tags.get("name", ""),
                "shop_type": tags.get("shop", tags.get("leisure", "")),
                "lat": lat,
                "lon": lon,
                "osm_id": el.get("id"),
            }
        )
    return rows


def download_gyms_and_groceries():
    gym_data = _query_overpass(OVERPASS_QUERY_GYMS, "gyms")
    gym_rows = _elements_to_rows(gym_data.get("elements", []), "gym")
    print(f"Found {len(gym_rows)} gyms.")

    grocery_data = _query_overpass(OVERPASS_QUERY_GROCERIES, "groceries")
    grocery_rows = _elements_to_rows(grocery_data.get("elements", []), "grocery")
    print(f"Found {len(grocery_rows)} grocery stores.")

    rows = gym_rows + grocery_rows

    print(f"Found {len(rows)} gyms/grocery stores.")
    with open("tallinn_gyms_groceries.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["category", "name", "shop_type", "lat", "lon", "osm_id"]
        )
        writer.writeheader()
        writer.writerows(rows)
    print("Saved -> tallinn_gyms_groceries.csv\n")
    return rows


if __name__ == "__main__":
    import os

    if os.path.exists("tallinn_bus_stops.csv"):
        print("tallinn_bus_stops.csv already exists, skipping bus stop download.\n")
    else:
        download_bus_stops()

    download_gyms_and_groceries()
    print("Done. You now have:")
    print("  - tallinn_bus_stops.csv")
    print("  - tallinn_gyms_groceries.csv")
    print("Both have lat/lon columns, ready to join against your apartment")
    print("coordinates (e.g. nearest-N stops/shops within X meters).")
