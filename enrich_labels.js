/**
 * enrich_labels.js
 * Enriches all Heathrow GeoJSON files with human-readable `_label` properties.
 * Run: node enrich_labels.js
 */
const fs = require('fs');
const path = require('path');

const MAP_DATA = path.join(__dirname, 'client/public/map-data');

// ── Helpers ──────────────────────────────────────────────────────────────────
function read(relPath) {
  return JSON.parse(fs.readFileSync(path.join(MAP_DATA, relPath), 'utf8'));
}
function write(relPath, data) {
  fs.writeFileSync(path.join(MAP_DATA, relPath), JSON.stringify(data, null, 0));
  console.log(`✓ Written ${relPath} (${data.features.length} features)`);
}

// Derive a terminal label
function termLabel(t) {
  if (!t) return '';
  return `T${t}`;
}

// ── 1. ENTRANCES ─────────────────────────────────────────────────────────────
function enrichEntrances() {
  const fc = read('entrances.geojson');
  const counters = {};

  fc.features = fc.features.map(f => {
    const p = f.properties || {};
    if (p.name) { p._label = p.name; return f; }

    const terminal = p.terminal ? `T${p.terminal}` : '';
    const entranceType = p.entrance || 'entrance';
    const typeLabel = {
      main:       'Main Entrance',
      yes:        'Entrance',
      parking:    'Parking Entrance',
      emergency:  'Emergency Exit',
      exit:       'Exit',
      service:    'Service Entrance',
      staircase:  'Staircase Entrance',
      unisex:     'Entrance',
    }[entranceType] || `${entranceType.charAt(0).toUpperCase()}${entranceType.slice(1)} Entrance`;

    // If destination present, use it
    if (p.destination) {
      p._label = p.destination.length > 40 ? p.destination.slice(0, 40) + '…' : p.destination;
      return f;
    }

    const key = `${terminal || 'Airport'}-${typeLabel}`;
    counters[key] = (counters[key] || 0) + 1;
    const num = String(counters[key]).padStart(2, '0');

    p._label = terminal
      ? `${terminal} ${typeLabel} ${num}`
      : `${typeLabel} ${num}`;

    return f;
  });

  write('entrances.geojson', fc);
}

// ── 2. GATES ─────────────────────────────────────────────────────────────────
function enrichGates() {
  const fc = read('gates.geojson');

  fc.features = fc.features.map(f => {
    const p = f.properties || {};
    const ref = p.ref || '';
    const terminal = p.terminal ? `T${p.terminal}` : '';

    if (p.name) { p._label = p.name; return f; }

    if (ref) {
      p._label = terminal ? `Gate ${ref} (${terminal})` : `Gate ${ref}`;
    } else {
      p._label = terminal ? `${terminal} Gate` : 'Gate';
    }
    return f;
  });

  write('gates.geojson', fc);
}

// ── 3. AMENITIES ─────────────────────────────────────────────────────────────
const AMENITY_LABELS = {
  restaurant: 'Restaurant', cafe: 'Café', bar: 'Bar', pub: 'Pub',
  fast_food: 'Fast Food', food_court: 'Food Court',
  shop: 'Shop', kiosk: 'Kiosk', supermarket: 'Supermarket',
  pharmacy: 'Pharmacy', bank: 'Bank', atm: 'ATM',
  toilets: 'Toilets', shower: 'Shower room',
  lounge: 'Lounge', hotel: 'Hotel',
  taxi: 'Taxi Stand', bus_station: 'Bus Stop',
  parking: 'Car Park', parking_entrance: 'Parking Entrance',
  fuel: 'Fuel Station',
  information: 'Information Desk', post_office: 'Post Office', post_box: 'Post Box',
  telephone: 'Telephone', vending_machine: 'Vending Machine',
  left_luggage: 'Left Luggage', luggage_locker: 'Luggage Lockers',
  baggage_claim: 'Baggage Claim', check_in: 'Check-in', ticket_office: 'Ticket Office',
  immigration: 'Immigration', customs: 'Customs', border_control: 'Border Control',
  police: 'Police', first_aid: 'First Aid', hospital: 'Hospital', clinic: 'Clinic',
  nursery: 'Nursery / Baby Room', prayer_room: 'Prayer Room', chapel: 'Chapel',
  smoking_area: 'Smoking Area',
  bicycle_parking: 'Bicycle Parking',
  car_wash: 'Car Wash',
  stop_position: 'Transit Stop',
};

const SHOP_LABELS = {
  clothes: 'Clothes', shoes: 'Shoes', books: 'Books',
  electronics: 'Electronics', mobile_phone: 'Phone Shop',
  travel: 'Travel Shop', gifts: 'Gift Shop', newsagent: 'Newsagent',
  duty_free: 'Duty Free', confectionery: 'Sweets', alcohol: 'Alcohol Shop',
  perfumery: 'Perfumery', cosmetics: 'Cosmetics', jewelry: 'Jewellery',
  optician: 'Optician', sports: 'Sports', toys: 'Toys',
  food: 'Food Shop',
};

function enrichAmenities() {
  const fc = read('amenities.geojson');
  const counters = {};

  fc.features = fc.features.map(f => {
    const p = f.properties || {};
    if (p.name) { p._label = p.name; return f; }

    // Build base label from tags
    let base = '';
    if (p.amenity) base = AMENITY_LABELS[p.amenity] || p.amenity.replace(/_/g, ' ');
    else if (p.shop)    base = SHOP_LABELS[p.shop] || (p.shop.charAt(0).toUpperCase() + p.shop.slice(1) + ' Shop');
    else if (p.railway === 'stop') base = 'Rail Stop';
    else if (p.public_transport) base = 'Transit Point';
    else if (p.tourism) base = p.tourism.charAt(0).toUpperCase() + p.tourism.slice(1);
    else if (p.aeroway) base = p.aeroway.charAt(0).toUpperCase() + p.aeroway.slice(1);
    else base = 'Facility';

    const terminal = p.terminal ? `T${p.terminal}` : '';
    const key = `${terminal || 'X'}-${base}`;
    counters[key] = (counters[key] || 0) + 1;
    const num = counters[key];

    p._label = terminal
      ? `${terminal} ${base}${num > 1 ? ' ' + num : ''}`
      : `${base}${num > 1 ? ' ' + num : ''}`;

    return f;
  });

  write('amenities.geojson', fc);
}

// ── 4. INDOOR MERGED ─────────────────────────────────────────────────────────
function enrichIndoor() {
  const fc = read('indoors/merged_indoor.geojson');
  const counters = {};

  fc.features = fc.features.map(f => {
    const p = f.properties || {};
    if (p.name) { p._label = p.name; return f; }

    const ref = p.ref || p.alt_ref || '';
    const cat = p._category || '';
    const level = p._level !== undefined ? `L${p._level}` : (p.level ? `L${p.level}` : '');
    const terminal = p.terminal ? `T${p.terminal}` : '';

    // Gate-like features with ref
    if (cat === 'gate' && ref) {
      p._label = `Gate ${ref}${terminal ? ` (${terminal})` : ''}`;
      return f;
    }

    // Named categories
    const catLabels = {
      gate: 'Gate', security: 'Security Checkpoint', lounge: 'Lounge',
      food: 'Food Outlet', shop: 'Shop', toilet: 'Toilets',
      elevator: 'Elevator', escalator: 'Escalator', stairs: 'Stairs',
      corridor: 'Corridor', room: 'Room', area: 'Area',
      baggage_claim: 'Baggage Claim', check_in: 'Check-in',
      information: 'Information Desk', atm: 'ATM', concourse: 'Concourse',
      border_control: 'Border Control', customs: 'Customs',
    };

    let base = catLabels[cat] || (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Indoor Area');

    // Use amenity/aeroway/barrier as fallback
    if (base === 'Indoor Area') {
      if (p.amenity) base = AMENITY_LABELS[p.amenity] || p.amenity.replace(/_/g, ' ');
      else if (p.aeroway) base = p.aeroway.replace(/_/g, ' ');
      else if (p.barrier) base = p.barrier.replace(/_/g, ' ');
      else if (p.indoor && p.indoor !== 'yes') base = p.indoor;
    }

    const key = `${terminal || 'X'}-${base}-${level}`;
    counters[key] = (counters[key] || 0) + 1;
    const num = counters[key];

    const parts = [terminal, base, level].filter(Boolean);
    p._label = parts.join(' ') + (num > 1 ? ` ${num}` : '');

    return f;
  });

  write('indoors/merged_indoor.geojson', fc);
}

// ── 5. LOUNGES ───────────────────────────────────────────────────────────────
function enrichLounges() {
  const fc = read('indoors/lounges.geojson');
  const counters = {};

  fc.features = fc.features.map(f => {
    const p = f.properties || {};
    if (p.name) { p._label = p.name; return f; }

    const terminal = p.terminal ? `T${p.terminal}` : '';
    const key = `${terminal || 'X'}-Lounge`;
    counters[key] = (counters[key] || 0) + 1;
    p._label = terminal ? `${terminal} Lounge ${counters[key]}` : `Lounge ${counters[key]}`;
    return f;
  });

  write('indoors/lounges.geojson', fc);
}

// ── 6. TERMINALS ─────────────────────────────────────────────────────────────
function enrichTerminals() {
  const fc = read('terminals.geojson');
  fc.features = fc.features.map(f => {
    const p = f.properties || {};
    p._label = p.name || p.loc_name || p.alt_name || 'Terminal';
    return f;
  });
  write('terminals.geojson', fc);
}

// ── RUN ALL ───────────────────────────────────────────────────────────────────
console.log('🏃 Enriching Heathrow GeoJSON labels…');
enrichTerminals();
enrichEntrances();
enrichGates();
enrichAmenities();
enrichIndoor();
enrichLounges();
console.log('\n✅ All done! Restart the Vite dev server for changes to take effect.');
