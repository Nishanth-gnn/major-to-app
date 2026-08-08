#!/usr/bin/env python3
"""
build_navigation_graph.py
=========================
Builds an A*-ready navigation graph from OSM walkway / corridor data.

Input:
  map-data/walkways.geojson
  map-data/indoors/level_*.geojson  (corridor lines)

Output:
  map-data/navigation_graph.json

Graph structure:
  {
    "nodes": { "id": { "lon", "lat", "level" } },
    "edges": [ { "from", "to", "weight", "level" } ]
  }

The JSON is loaded by the MapLibre frontend for client-side A* pathfinding.
"""

import json, math
from pathlib import Path
from collections import defaultdict

BASE_DIR   = Path(__file__).parent
MAP_DATA   = BASE_DIR / "map-data"
INDOOR_DIR = MAP_DATA / "indoors"
OUT_PATH   = MAP_DATA / "navigation_graph.json"

def haversine(a, b) -> float:
    """Distance in metres between two [lon, lat] points."""
    R = 6_371_000
    la1, lo1 = math.radians(a[1]), math.radians(a[0])
    la2, lo2 = math.radians(b[1]), math.radians(b[0])
    dlat = la2 - la1; dlon = lo2 - lo1
    h = math.sin(dlat/2)**2 + math.cos(la1)*math.cos(la2)*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(h))

def coord_key(lon, lat) -> str:
    return f"{lon:.6f},{lat:.6f}"

def process_linestring(coords: list, level: int | None, nodes: dict, edges: list):
    """Turn a LineString into graph nodes + edges."""
    prev_key = None
    for c in coords:
        lon, lat = c[0], c[1]
        k = coord_key(lon, lat)
        if k not in nodes:
            nodes[k] = {"lon": lon, "lat": lat, "level": level}
        if prev_key is not None:
            prev = nodes[prev_key]
            dist = haversine([prev["lon"], prev["lat"]], [lon, lat])
            edges.append({"from": prev_key, "to": k, "weight": round(dist, 2), "level": level})
            edges.append({"from": k, "to": prev_key, "weight": round(dist, 2), "level": level})
        prev_key = k

def add_elevator_edges(nodes: dict, edges: list):
    """
    Add zero-cost edges between elevator nodes on adjacent floors.
    Identifies elevators by proximity (<5 m) at different levels.
    """
    elevator_nodes = {k: v for k, v in nodes.items() if v.get("level") is not None}
    keys = list(elevator_nodes.keys())
    for i, k1 in enumerate(keys):
        n1 = elevator_nodes[k1]
        for k2 in keys[i+1:]:
            n2 = elevator_nodes[k2]
            if n1["level"] == n2["level"]:
                continue
            d = haversine([n1["lon"], n1["lat"]], [n2["lon"], n2["lat"]])
            if d < 15:  # within 15 m → treat as elevator/stair transition
                cost = abs((n1["level"] or 0) - (n2["level"] or 0)) * 30  # 30s per floor
                edges.append({"from": k1, "to": k2, "weight": cost, "level": "transition"})
                edges.append({"from": k2, "to": k1, "weight": cost, "level": "transition"})

def load_file(fpath: Path, level_override=None) -> tuple[list, list]:
    nodes = {}
    edges = []
    try:
        with open(fpath, encoding="utf-8") as f:
            fc = json.load(f)
    except Exception as e:
        print(f"  SKIP {fpath.name}: {e}", flush=True)
        return nodes, edges

    for feat in fc.get("features", []):
        geom  = feat.get("geometry") or {}
        props = feat.get("properties") or {}
        gtype = geom.get("type", "")

        # Determine level
        raw_lvl = props.get("level") or props.get("layer")
        try:
            level = int(float(str(raw_lvl).split(";")[0])) if raw_lvl is not None else level_override
        except Exception:
            level = level_override

        coords = geom.get("coordinates", [])
        if gtype == "LineString":
            process_linestring(coords, level, nodes, edges)
        elif gtype == "Polygon" and coords:
            process_linestring(coords[0], level, nodes, edges)

    return nodes, edges

def main():
    print("\n" + "="*60)
    print("  Heathrow Navigation Graph Builder")
    print("="*60)

    all_nodes: dict = {}
    all_edges: list = []

    # 1. Outdoor walkways (ground level = 0)
    walkways_path = MAP_DATA / "walkways.geojson"
    if walkways_path.exists():
        print(f"\nLoading walkways…", flush=True)
        n, e = load_file(walkways_path, level_override=0)
        all_nodes.update(n)
        all_edges.extend(e)
        print(f"  → {len(n)} nodes, {len(e)} edges")
    else:
        print("  walkways.geojson not found — skipping")

    # 2. Indoor floor layers
    if INDOOR_DIR.exists():
        for fpath in sorted(INDOOR_DIR.glob("level_*.geojson")):
            # Extract level from filename e.g. level_1 → 1, level_b1 → -1
            stem = fpath.stem  # e.g. "level_b1", "level_0"
            if "b" in stem:
                lvl = -int(stem.replace("level_b",""))
            else:
                try: lvl = int(stem.replace("level_",""))
                except Exception: lvl = None

            print(f"\nLoading {fpath.name} (level={lvl})…", flush=True)
            n, e = load_file(fpath, level_override=lvl)
            all_nodes.update(n)
            all_edges.extend(e)
            print(f"  → {len(n)} nodes, {len(e)} edges")
    else:
        print("\nNo map-data/indoors/ found — only outdoor graph built")

    # 3. Add elevator/stair transitions
    print("\nAdding level-transition edges…", flush=True)
    before = len(all_edges)
    add_elevator_edges(all_nodes, all_edges)
    print(f"  → {len(all_edges)-before} transition edges added")

    # 4. Deduplicate edges
    edge_set = set()
    deduped  = []
    for e in all_edges:
        key = (e["from"], e["to"])
        if key not in edge_set:
            edge_set.add(key)
            deduped.append(e)
    all_edges = deduped

    # 5. Save
    graph = {"nodes": all_nodes, "edges": all_edges}
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, separators=(",",":"))

    size_kb = OUT_PATH.stat().st_size / 1024
    print(f"\nNavigation graph saved: {OUT_PATH}")
    print(f"  Nodes : {len(all_nodes)}")
    print(f"  Edges : {len(all_edges)}")
    print(f"  Size  : {size_kb:.1f} KB")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
