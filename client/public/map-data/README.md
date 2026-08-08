# Heathrow Airport – OSM Geospatial Dataset

> **Research prototype dataset** for AI experimentation and airport-navigation research.  
> All data is sourced from **OpenStreetMap** (© OpenStreetMap contributors, [ODbL](https://opendatacommons.org/licenses/odbl/)).  
> No proprietary Heathrow data is used.

---

## 📂 Dataset Contents

| File | Description | Geometry types |
|---|---|---|
| `terminals.geojson` | Terminal building footprints (T2, T3, T4, T5) | Polygon, MultiPolygon |
| `entrances.geojson` | Terminal entrance / exit nodes | Point |
| `gates.geojson` | Boarding gates, boarding areas, concourses | Point, LineString, Polygon |
| `amenities.geojson` | Toilets, ATMs, restaurants, shops, info desks, security, baggage claim, lounges, lifts, escalators, check-in counters, transit stops | Point |
| `roads.geojson` | Roads, motorways, service roads around the airport | LineString |
| `walkways.geojson` | Pedestrian footways, corridors, rail / tube lines | LineString |

---

## 🛠️ Regenerating the Data

```bash
# No third-party packages required – uses only Python standard library
python fetch_heathrow_osm.py
```

The script will create or overwrite every file inside `map-data/`.  
A 3-second pause between requests respects the Overpass API fair-use policy.

---

## 🌍 Coordinate Reference System

**WGS 84 – EPSG:4326** (longitude / latitude decimal degrees).  
All GeoJSON coordinates follow the standard `[longitude, latitude]` order.

---

## 🔍 Overpass Queries Used

The script issues one Overpass QL query per category.  
Below are the key tag filters used.

### Terminals
```
way["aeroway"="terminal"]
relation["aeroway"="terminal"]
```

### Entrances
```
node["entrance"]
node["door"]
```

### Gates
```
node["aeroway"="gate"]
node["aeroway"="boarding_area"]
way["aeroway"="concourse"]
```

### Amenities
```
node["amenity"~"toilets|atm|restaurant|cafe|fast_food|bar"]
node["shop"]
node["aeroway"~"security|baggage_claim|lounge|check_in"]
node["highway"="elevator"]
node["conveyance"~"escalator|moving_walkway"]
node["public_transport"="stop_position"]
```

### Roads
```
way["highway"~"motorway|trunk|primary|secondary|tertiary|service|…"]
```

### Walkways / Transit
```
way["highway"~"footway|pedestrian|path|corridor"]
way["railway"~"rail|subway|light_rail|tram"]
```

**Bounding box:** `51.4600,-0.5050,51.4900,-0.4300`

---

## 🗺️ Loading the Data

### Leaflet (browser / HTML)

```html
<!-- Include Leaflet -->
<link  rel="stylesheet" href="https://unpkg.com/leaflet@1.9/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9/dist/leaflet.js"></script>

<script>
const map = L.map('map').setView([51.477, -0.461], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

fetch('map-data/terminals.geojson')
  .then(r => r.json())
  .then(data => L.geoJSON(data, { style: { color: '#2979ff' } }).addTo(map));
</script>
```

> **Note:** browsers block `fetch()` for local `file://` URLs.  
> Serve with a local HTTP server:  
> `python -m http.server 8080`  then open `http://localhost:8080`.

### Mapbox GL JS

```javascript
map.addSource('terminals', { type: 'geojson', data: 'map-data/terminals.geojson' });
map.addLayer({
  id: 'terminals-fill',
  type: 'fill',
  source: 'terminals',
  paint: { 'fill-color': '#2979ff', 'fill-opacity': 0.4 }
});
```

### Three.js / Deck.gl

```javascript
import { GeoJsonLayer } from '@deck.gl/layers';

new GeoJsonLayer({
  id: 'terminals',
  data: 'map-data/terminals.geojson',
  filled: true,
  getFillColor: [41, 121, 255, 100],
  stroked: true,
  getLineColor: [41, 121, 255],
  lineWidthMinPixels: 2,
});
```

---

## 📝 Notes on Indoor Mapping

OSM indoor coverage of Heathrow varies by terminal.  
- **Terminal 5** has the most complete indoor tagging.  
- **Terminals 2 & 3** have partial coverage.  
- **Terminal 4** has minimal indoor data.

Where OSM indoor data is absent, only building footprints and entrance nodes
are included. **No gate or security positions have been fabricated.**

---

## 📜 License

Data: **ODbL 1.0** – © OpenStreetMap contributors  
Code: **MIT**
