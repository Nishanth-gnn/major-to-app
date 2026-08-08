#!/usr/bin/env python3
"""Retry only the failed layers with longer delays."""
import json, os, time, urllib.request, urllib.parse

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
BASE = os.path.dirname(os.path.abspath(__file__))
BBOX = "51.4600,-0.5050,51.4900,-0.4300"
DELAY = 12

RETRIES = {
    os.path.join(BASE,"map-data","entrances.geojson"): f"""
[out:json][timeout:60];
(node["entrance"]({BBOX}); node["door"]({BBOX}););
out body;
""",
    os.path.join(BASE,"map-data","roads.geojson"): f"""
[out:json][timeout:60];
(way["highway"~"motorway|trunk|primary|secondary|tertiary|service|motorway_link|trunk_link"]({BBOX}););
out body geom;
""",
    os.path.join(BASE,"map-data","walkways.geojson"): f"""
[out:json][timeout:60];
(way["highway"~"footway|pedestrian|path|steps"]({BBOX}); way["railway"~"rail|light_rail"]({BBOX}););
out body geom;
""",
    os.path.join(BASE,"map-data","indoors","level_b1.geojson"): f"""
[out:json][timeout:90];
(way["indoor"]({BBOX})["level"~"^-"]; node["indoor"]({BBOX})["level"~"^-"];
 node["aeroway"="gate"]({BBOX})["level"~"^-"]; node["highway"="elevator"]({BBOX}););
out body geom;
""",
    os.path.join(BASE,"map-data","indoors","level_0.geojson"): f"""
[out:json][timeout:90];
(way["indoor"]({BBOX})["level"="0"]; node["indoor"]({BBOX})["level"="0"];
 node["aeroway"="gate"]({BBOX})["level"="0"];
 way["highway"="corridor"]({BBOX})["level"="0"];);
out body geom;
""",
    os.path.join(BASE,"map-data","indoors","level_2.geojson"): f"""
[out:json][timeout:90];
(way["indoor"]({BBOX})["level"="2"]; node["indoor"]({BBOX})["level"="2"];
 node["aeroway"="gate"]({BBOX})["level"="2"];);
out body geom;
""",
    os.path.join(BASE,"map-data","indoors","rooms_all.geojson"): f"""
[out:json][timeout:90];
(way["indoor"~"room|area|corridor"]({BBOX}); way["room"]({BBOX}););
out body geom;
""",
    os.path.join(BASE,"map-data","indoors","security.geojson"): f"""
[out:json][timeout:60];
(node["aeroway"="security"]({BBOX}); way["aeroway"="security"]({BBOX}););
out body geom;
""",
}

def node_to_feature(el):
    return {"type":"Feature","geometry":{"type":"Point","coordinates":[el["lon"],el["lat"]]},"properties":{**el.get("tags",{}),"osm_id":el["id"],"osm_type":"node"}}

def way_to_feature(el):
    geom=el.get("geometry",[])
    if not geom: return None
    coords=[[p["lon"],p["lat"]] for p in geom]
    if len(coords)>=4 and coords[0]==coords[-1]: geo={"type":"Polygon","coordinates":[coords]}
    else: geo={"type":"LineString","coordinates":coords}
    return {"type":"Feature","geometry":geo,"properties":{**el.get("tags",{}),"osm_id":el["id"],"osm_type":"way"}}

def osm_to_fc(raw):
    feats=[]
    for el in raw.get("elements",[]):
        t=el.get("type")
        if t=="node": feats.append(node_to_feature(el))
        elif t=="way":
            f=way_to_feature(el)
            if f: feats.append(f)
    return {"type":"FeatureCollection","features":feats}

def fetch(query):
    data=urllib.parse.urlencode({"data":query}).encode()
    req=urllib.request.Request(OVERPASS_URL,data=data,headers={
        "Content-Type":"application/x-www-form-urlencoded",
        "User-Agent":"HeathrowFetcher/2.0","Accept":"application/json"})
    with urllib.request.urlopen(req,timeout=120) as r:
        return json.loads(r.read())

for idx,(path,query) in enumerate(RETRIES.items()):
    name=os.path.basename(path)
    print(f"\n[{name}]",flush=True)
    os.makedirs(os.path.dirname(path),exist_ok=True)
    try:
        raw=fetch(query)
        fc=osm_to_fc(raw)
        with open(path,"w",encoding="utf-8") as f:
            json.dump(fc,f,ensure_ascii=False,indent=2)
        n=len(fc["features"]); kb=os.path.getsize(path)/1024
        print(f"  OK  {name}  ({n} features, {kb:.1f} KB)")
    except Exception as e:
        print(f"  ERROR: {e}")
    if idx<len(RETRIES)-1:
        print(f"  (waiting {DELAY}s...)",flush=True)
        time.sleep(DELAY)
print("\nDone.")
