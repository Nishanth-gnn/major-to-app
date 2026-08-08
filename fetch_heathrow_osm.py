#!/usr/bin/env python3
"""
fetch_heathrow_osm.py  (v2 – indoor edition)
=============================================
Fetches both the existing 6 outdoor layers AND 8 new indoor floor layers
from OpenStreetMap via the Overpass API.

Outdoor layers  → map-data/
Indoor layers   → map-data/indoors/
"""

import json, os, time, urllib.request, urllib.parse, urllib.error

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR   = os.path.join(BASE_DIR, "map-data")
INDOOR_DIR   = os.path.join(OUTPUT_DIR, "indoors")
BBOX         = "51.4600,-0.5050,51.4900,-0.4300"
DELAY        = 4   # seconds between requests

# ─── Outdoor Queries ──────────────────────────────────────────────────────────
OUTDOOR_QUERIES = {
    "terminals": f"""
[out:json][timeout:60];
(
  way["aeroway"="terminal"]({BBOX});
  relation["aeroway"="terminal"]({BBOX});
);
out body geom;
""",
    "entrances": f"""
[out:json][timeout:60];
(
  node["entrance"]({BBOX});
  node["door"]({BBOX});
);
out body;
""",
    "gates": f"""
[out:json][timeout:60];
(
  node["aeroway"="gate"]({BBOX});
  way["aeroway"="gate"]({BBOX});
  node["aeroway"="boarding_area"]({BBOX});
  way["aeroway"="concourse"]({BBOX});
);
out body geom;
""",
    "amenities": f"""
[out:json][timeout:90];
(
  node["amenity"~"toilets|atm|restaurant|cafe|fast_food|bar|pharmacy"]({BBOX});
  node["shop"]({BBOX});
  node["tourism"="information"]({BBOX});
  node["aeroway"~"security|baggage_claim|check_in"]({BBOX});
  way["aeroway"~"security|baggage_claim|check_in"]({BBOX});
  node["aeroway"="lounge"]({BBOX});
  way["aeroway"="lounge"]({BBOX});
  node["highway"="elevator"]({BBOX});
  node["conveyance"~"escalator|moving_walkway"]({BBOX});
  node["public_transport"="stop_position"]({BBOX});
);
out body;
""",
    "roads": f"""
[out:json][timeout:60];
(
  way["highway"~"motorway|trunk|primary|secondary|tertiary|unclassified|service|motorway_link|trunk_link|primary_link"]({BBOX});
);
out body geom;
""",
    "walkways": f"""
[out:json][timeout:60];
(
  way["highway"~"footway|pedestrian|path|steps|corridor"]({BBOX});
  way["railway"~"rail|light_rail|tram"]({BBOX});
);
out body geom;
""",
}

# ─── Indoor Queries ───────────────────────────────────────────────────────────
def indoor_query(level_filter: str) -> str:
    return f"""
[out:json][timeout:90];
(
  way["indoor"]({BBOX}){level_filter};
  way["room"]({BBOX}){level_filter};
  way["highway"="corridor"]({BBOX}){level_filter};
  way["aeroway"~"gate|lounge|security|check_in|baggage_claim|concourse"]({BBOX}){level_filter};
  node["indoor"]({BBOX}){level_filter};
  node["door"]({BBOX}){level_filter};
  node["entrance"]({BBOX}){level_filter};
  node["highway"="elevator"]({BBOX}){level_filter};
  node["aeroway"~"gate|lounge"]({BBOX}){level_filter};
);
out body geom;
"""

INDOOR_QUERIES = {
    "level_b1":    indoor_query('["level"~"^-[123]$"]'),
    "level_0":     indoor_query('["level"="0"]'),
    "level_1":     indoor_query('["level"="1"]'),
    "level_2":     indoor_query('["level"="2"]'),
    "level_3":     indoor_query('["level"="3"]'),
    "rooms_all":   f"""
[out:json][timeout:90];
(
  way["indoor"~"room|area|corridor|level"]({BBOX});
  way["room"]({BBOX});
  relation["type"="building"]["building"="yes"]({BBOX});
);
out body geom;
""",
    "security":    f"""
[out:json][timeout:60];
(
  node["aeroway"="security"]({BBOX});
  way["aeroway"="security"]({BBOX});
  node["indoor"="security"]({BBOX});
  way["indoor"="security"]({BBOX});
);
out body geom;
""",
    "lounges":     f"""
[out:json][timeout:60];
(
  node["aeroway"="lounge"]({BBOX});
  way["aeroway"="lounge"]({BBOX});
  node["amenity"="lounge"]({BBOX});
  way["amenity"="lounge"]({BBOX});
);
out body geom;
""",
}

# ─── Helpers ──────────────────────────────────────────────────────────────────
def query_overpass(query: str) -> dict:
    data = urllib.parse.urlencode({"data": query}).encode()
    req  = urllib.request.Request(
        OVERPASS_URL, data=data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":   "HeathrowIndoorFetcher/2.0 (research prototype)",
            "Accept":       "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read())

def node_to_feature(el):
    return {"type":"Feature","geometry":{"type":"Point","coordinates":[el["lon"],el["lat"]]},"properties":{**el.get("tags",{}),"osm_id":el["id"],"osm_type":"node"}}

def way_to_feature(el):
    geom = el.get("geometry", [])
    if not geom: return None
    coords = [[p["lon"],p["lat"]] for p in geom]
    if len(coords)>=4 and coords[0]==coords[-1]:
        geo = {"type":"Polygon","coordinates":[coords]}
    else:
        geo = {"type":"LineString","coordinates":coords}
    return {"type":"Feature","geometry":geo,"properties":{**el.get("tags",{}),"osm_id":el["id"],"osm_type":"way"}}

def relation_to_feature(el):
    rings = []
    for m in el.get("members",[]):
        if m.get("type")=="way" and m.get("role") in ("outer",""):
            g = m.get("geometry",[])
            if g:
                r = [[p["lon"],p["lat"]] for p in g]
                if len(r)>=4 and r[0]==r[-1]: rings.append([r])
    if not rings: return None
    geo = {"type":"Polygon","coordinates":rings[0]} if len(rings)==1 else {"type":"MultiPolygon","coordinates":rings}
    return {"type":"Feature","geometry":geo,"properties":{**el.get("tags",{}),"osm_id":el["id"],"osm_type":"relation"}}

def osm_to_geojson(raw):
    features=[]
    for el in raw.get("elements",[]):
        t=el.get("type")
        if t=="node": features.append(node_to_feature(el))
        elif t=="way":
            f=way_to_feature(el)
            if f: features.append(f)
        elif t=="relation":
            f=relation_to_feature(el)
            if f: features.append(f)
    return {"type":"FeatureCollection","features":features}

def save(name, geojson, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{name}.geojson")
    with open(path,"w",encoding="utf-8") as f:
        json.dump(geojson,f,ensure_ascii=False,indent=2)
    kb = os.path.getsize(path)/1024
    n  = len(geojson.get("features",[]))
    print(f"  OK  {name}.geojson  ({n} features, {kb:.1f} KB)", flush=True)

def run_batch(label, queries, out_dir):
    names = list(queries.keys())
    for idx,(name,q) in enumerate(queries.items()):
        print(f"\n[{label.upper()} · {name.upper()}]", flush=True)
        try:
            raw  = query_overpass(q)
            fc   = osm_to_geojson(raw)
            save(name, fc, out_dir)
        except urllib.error.HTTPError as e:
            print(f"  ERROR HTTP {e.code}: {e.reason}")
        except Exception as e:
            print(f"  ERROR: {e}")
        if idx < len(names)-1:
            print(f"  (Pausing {DELAY}s...)", flush=True)
            time.sleep(DELAY)

def main():
    print("\n" + "="*60)
    print("  Heathrow OSM Fetcher v2 – Indoor Edition")
    print("="*60)
    run_batch("OUTDOOR", OUTDOOR_QUERIES, OUTPUT_DIR)
    print("\n" + "-"*60)
    run_batch("INDOOR",  INDOOR_QUERIES,  INDOOR_DIR)
    print("\n" + "="*60)
    total_mb = sum(
        os.path.getsize(os.path.join(d,f))/1e6
        for d in [OUTPUT_DIR, INDOOR_DIR]
        for f in os.listdir(d) if f.endswith(".geojson")
    )
    print(f"  Done!  Total GeoJSON: {total_mb:.2f} MB")
    print("="*60 + "\n")

if __name__=="__main__":
    main()
