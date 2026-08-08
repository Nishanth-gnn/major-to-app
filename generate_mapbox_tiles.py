#!/usr/bin/env python3
"""
generate_mapbox_tiles.py
========================
Generates a lightweight tile manifest pointing at all GeoJSON source files.
Also attempts to create .mbtiles using tippecanoe if installed.
Falls back to a pure-Python manifest so the MapLibre app always has a
tile source it can reference.

Output:
  map-data/raw/tile_manifest.json   ← always generated
  map-data/raw/heathrow.mbtiles     ← only if tippecanoe is installed
"""

import json, os, subprocess, shutil
from pathlib import Path

BASE_DIR = Path(__file__).parent
MAP_DATA = BASE_DIR / "map-data"
RAW_DIR  = MAP_DATA / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

# All GeoJSON layers to include in the manifest
LAYER_DEFS = [
    # (layer_id, relative_path, min_zoom, max_zoom)
    ("terminals",      "map-data/terminals.geojson",              8,  22),
    ("entrances",      "map-data/entrances.geojson",             12,  22),
    ("gates",          "map-data/gates.geojson",                 12,  22),
    ("amenities",      "map-data/amenities.geojson",             13,  22),
    ("roads",          "map-data/roads.geojson",                  8,  22),
    ("walkways",       "map-data/walkways.geojson",              12,  22),
    ("indoor_b1",      "map-data/indoors/level_b1.geojson",      14,  22),
    ("indoor_0",       "map-data/indoors/level_0.geojson",       14,  22),
    ("indoor_1",       "map-data/indoors/level_1.geojson",       14,  22),
    ("indoor_2",       "map-data/indoors/level_2.geojson",       14,  22),
    ("indoor_3",       "map-data/indoors/level_3.geojson",       14,  22),
    ("indoor_rooms",   "map-data/indoors/rooms_all.geojson",     15,  22),
    ("indoor_security","map-data/indoors/security.geojson",      13,  22),
    ("indoor_lounges", "map-data/indoors/lounges.geojson",       13,  22),
    ("indoor_merged",  "map-data/indoors/merged_indoor.geojson", 13,  22),
    ("nav_graph",      "map-data/navigation_graph.json",         10,  22),
]

def build_manifest() -> dict:
    manifest = {
        "name":        "Heathrow Airport OSM Dataset",
        "description": "Research prototype – open GIS data only",
        "crs":         "WGS84 EPSG:4326",
        "server":      "http://localhost:8092",
        "layers":      []
    }
    for layer_id, rel_path, min_z, max_z in LAYER_DEFS:
        abs_path = BASE_DIR / rel_path
        entry = {
            "id":        layer_id,
            "path":      rel_path,
            "url":       f"http://localhost:8092/{rel_path}",
            "min_zoom":  min_z,
            "max_zoom":  max_z,
            "exists":    abs_path.exists(),
            "size_kb":   round(abs_path.stat().st_size / 1024, 1) if abs_path.exists() else 0,
        }
        manifest["layers"].append(entry)
        status = "OK" if entry["exists"] else "MISSING"
        print(f"  [{status}] {layer_id:<25} {entry['size_kb']:>8.1f} KB  {rel_path}")
    return manifest

def try_tippecanoe(manifest: dict):
    """Try to run tippecanoe if available to produce .mbtiles."""
    if not shutil.which("tippecanoe"):
        print("\ntippecanoe not found — skipping .mbtiles generation")
        print("(Install tippecanoe on Linux/macOS with: brew install tippecanoe)")
        return

    input_files = [
        str(BASE_DIR / l["path"])
        for l in manifest["layers"]
        if l["exists"] and l["path"].endswith(".geojson")
    ]
    out_mbtiles = RAW_DIR / "heathrow.mbtiles"
    cmd = [
        "tippecanoe",
        "-o", str(out_mbtiles),
        "--force",
        "--minimum-zoom=8",
        "--maximum-zoom=22",
        "--detect-shared-borders",
        "--simplification=2",
        "-l", "heathrow",
        *input_files,
    ]
    print(f"\nRunning tippecanoe → {out_mbtiles}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        size_mb = out_mbtiles.stat().st_size / 1e6
        print(f"  OK  heathrow.mbtiles  ({size_mb:.2f} MB)")
    else:
        print(f"  tippecanoe error: {result.stderr[:200]}")

def main():
    print("\n" + "="*60)
    print("  Heathrow Tile Manifest Generator")
    print("="*60)

    manifest = build_manifest()

    # Save manifest
    out_path = RAW_DIR / "tile_manifest.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    present = sum(1 for l in manifest["layers"] if l["exists"])
    total   = len(manifest["layers"])
    print(f"\nManifest: {out_path}")
    print(f"  {present}/{total} layers present")

    try_tippecanoe(manifest)
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
