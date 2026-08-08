#!/usr/bin/env python3
"""
merge_indoor_datasets.py
========================
Reads all map-data/indoors/*.geojson files, normalises indoor tags,
assigns semantic categories, deduplicates nodes, and outputs:
  map-data/indoors/merged_indoor.geojson
"""

import json, os, math
from pathlib import Path
from collections import defaultdict

BASE_DIR   = Path(__file__).parent
INDOOR_DIR = BASE_DIR / "map-data" / "indoors"
OUT_PATH   = INDOOR_DIR / "merged_indoor.geojson"

# ── Category mapping ──────────────────────────────────────────────────────────
def categorise(props: dict) -> str:
    aeroway  = props.get("aeroway", "")
    indoor   = props.get("indoor", "")
    amenity  = props.get("amenity", "")
    shop     = props.get("shop", "")
    highway  = props.get("highway", "")
    conveyance = props.get("conveyance", "")
    room     = props.get("room", "")
    name     = props.get("name", "").lower()

    if aeroway == "gate":               return "gate"
    if aeroway == "security":           return "security"
    if aeroway == "baggage_claim":      return "baggage_claim"
    if aeroway == "check_in":           return "check_in"
    if aeroway == "lounge":             return "lounge"
    if aeroway == "concourse":          return "concourse"
    if amenity == "toilets":            return "toilet"
    if amenity == "atm":                return "atm"
    if amenity in ("restaurant","cafe","fast_food","bar","food_court"): return "food"
    if amenity == "pharmacy":           return "pharmacy"
    if amenity == "bureau_de_change":   return "currency"
    if shop:                            return "shop"
    if highway == "elevator":           return "elevator"
    if conveyance in ("escalator","moving_walkway"): return conveyance
    if indoor == "corridor" or highway == "corridor": return "corridor"
    if indoor in ("room","area"):       return room or indoor
    if "immigration" in name or "border" in name:  return "immigration"
    if "passport" in name:              return "passport_control"
    if "duty" in name:                  return "duty_free"
    if "information" in name:           return "information"
    return indoor or aeroway or amenity or "area"

# ── Level normalisation ───────────────────────────────────────────────────────
def normalise_level(raw: str) -> int | None:
    try:
        parts = str(raw).split(";")
        return int(float(parts[0].strip()))
    except Exception:
        return None

# ── Dedup by geometry signature ───────────────────────────────────────────────
def geom_key(geom: dict) -> str:
    t = geom.get("type","")
    c = geom.get("coordinates")
    if t == "Point":
        return f"PT{c[0]:.6f},{c[1]:.6f}"
    if t in ("LineString","Polygon","MultiPolygon"):
        return f"{t}_{hash(str(c))}"
    return str(c)

def main():
    print("\n" + "="*60)
    print("  Heathrow Indoor Dataset Merger")
    print("="*60)

    if not INDOOR_DIR.exists():
        print("ERROR: map-data/indoors/ does not exist. Run fetch_heathrow_osm.py first.")
        return

    files = sorted(INDOOR_DIR.glob("*.geojson"))
    if not files:
        print("No .geojson files found in map-data/indoors/")
        return

    seen_keys = set()
    merged    = []
    stats     = defaultdict(int)

    for fpath in files:
        if fpath.stem == "merged_indoor":
            continue
        print(f"\nProcessing: {fpath.name}", flush=True)
        with open(fpath, encoding="utf-8") as f:
            fc = json.load(f)

        for feat in fc.get("features", []):
            geom  = feat.get("geometry") or {}
            props = feat.get("properties") or {}

            # Skip null geometries
            if not geom or not geom.get("coordinates"):
                continue

            # Dedup
            key = geom_key(geom)
            if key in seen_keys:
                continue
            seen_keys.add(key)

            # Normalise level
            raw_level = props.get("level") or props.get("layer")
            level = normalise_level(raw_level) if raw_level is not None else None

            # Assign category
            category = categorise(props)
            stats[category] += 1

            # Build enriched feature
            enriched = {
                "type": "Feature",
                "geometry": geom,
                "properties": {
                    **props,
                    "_category": category,
                    "_level":    level,
                    "_source":   fpath.stem,
                }
            }
            merged.append(enriched)

    fc_out = {"type": "FeatureCollection", "features": merged}
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(fc_out, f, ensure_ascii=False, indent=2)

    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"\nMerged indoor dataset: {OUT_PATH}")
    print(f"  Total features : {len(merged)}")
    print(f"  File size      : {size_kb:.1f} KB")
    print("\n  Category breakdown:")
    for cat, n in sorted(stats.items(), key=lambda x:-x[1])[:20]:
        print(f"    {cat:<25} {n}")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
