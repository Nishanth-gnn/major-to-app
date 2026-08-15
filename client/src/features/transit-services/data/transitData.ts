import { Airport, TransitModeInfo, MetroService, BusInfo, TerminalTransferGuidance, TransitNotification, MultiModalOption, AITransitRecommendation } from '../types';

export const AIRPORTS: Airport[] = [
  // INDIA
  {
    id: 'hyd',
    code: 'HYD',
    name: 'Rajiv Gandhi International Airport',
    city: 'Hyderabad',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 1',
    defaultMetroStation: 'RGIA Airport Station',
    transitModes: ['metro', 'bus', 'cab', 'walking'],
    destinations: ['Miyapur', 'Ameerpet', 'Secunderabad', 'JBS', 'Koti', 'LB Nagar', 'Uppal', 'Gachibowli', 'Hitech City', 'Kondapur'],
  },
  {
    id: 'del',
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    city: 'Delhi',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 3',
    defaultMetroStation: 'IGI Airport T3 Metro Station',
    transitModes: ['metro', 'skytrain', 'bus', 'cab', 'walking'],
    destinations: ['New Delhi Railway Station', 'Dhaula Kuan', 'Shivaji Stadium', 'Rajiv Chowk', 'Gurugram Cyber City', 'Noida City Centre'],
  },
  {
    id: 'bom',
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj Airport',
    city: 'Mumbai',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 2',
    defaultMetroStation: 'CSMIA T2 Metro Station',
    transitModes: ['metro', 'bus', 'cab', 'walking'],
    destinations: ['Andheri', 'Bandra Kurla Complex (BKC)', 'Colaba', 'Dadar', 'Thane', 'Vashi'],
  },
  {
    id: 'blr',
    code: 'BLR',
    name: 'Kempegowda International Airport',
    city: 'Bengaluru',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 2',
    defaultMetroStation: 'KIA Airport Metro Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['MG Road', 'Indiranagar', 'Electronic City', 'Whitefield', 'Hebbal', 'Majestic Bus Stand'],
  },
  {
    id: 'maa',
    code: 'MAA',
    name: 'Chennai International Airport',
    city: 'Chennai',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 2',
    defaultMetroStation: 'Chennai Airport Metro Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Central Railway Station', 'T Nagar', 'Guindy', 'Anna Nagar', 'Koyambedu'],
  },
  {
    id: 'cok',
    code: 'COK',
    name: 'Cochin International Airport',
    city: 'Kochi',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 3',
    defaultMetroStation: 'Aluva Metro Station Link',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Aluva', 'Edapally', 'MG Road Kochi', 'Vytilla Mobility Hub', 'Fort Kochi'],
  },
  {
    id: 'amd',
    code: 'AMD',
    name: 'Sardar Vallabhbhai Patel Airport',
    city: 'Ahmedabad',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 2',
    defaultMetroStation: 'SVPIA Metro Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Gandhinagar', 'Kalupur Railway Station', 'SG Highway', 'Maninagar'],
  },
  {
    id: 'lko',
    code: 'LKO',
    name: 'Chaudhary Charan Singh Airport',
    city: 'Lucknow',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 3',
    defaultMetroStation: 'CCS Airport Metro Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Charbagh Railway Station', 'Hazratganj', 'Munshipulia', 'Alambagh'],
  },
  {
    id: 'ccu',
    code: 'CCU',
    name: 'Netaji Subhash Chandra Bose Airport',
    city: 'Kolkata',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Terminal 1',
    defaultMetroStation: 'Biman Bandar Metro Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Howrah Station', 'Esplanade', 'Salt Lake Sector V', 'New Town', 'Park Street'],
  },
  {
    id: 'gox',
    code: 'GOX',
    name: 'Manohar International Airport',
    city: 'Goa',
    country: 'India',
    region: 'India',
    flag: '🇮🇳',
    defaultTerminal: 'Main Terminal',
    defaultMetroStation: 'Mopa Transit Centre',
    transitModes: ['bus', 'cab'],
    destinations: ['Panaji', 'Calangute', 'Margao', 'Mapusa', 'Candolim'],
  },

  // MIDDLE EAST
  {
    id: 'dxb',
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    flag: '🇦🇪',
    defaultTerminal: 'Terminal 3',
    defaultMetroStation: 'DXB Airport T3 Metro Station',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Burj Khalifa / Dubai Mall', 'Dubai Marina', 'Mall of the Emirates', 'Deira City Centre', 'Business Bay'],
  },
  {
    id: 'auh',
    code: 'AUH',
    name: 'Zayed International Airport',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    region: 'Middle East',
    flag: '🇦🇪',
    defaultTerminal: 'Terminal A',
    defaultMetroStation: 'Zayed Airport Express Hub',
    transitModes: ['bus', 'cab'],
    destinations: ['Corniche Abu Dhabi', 'Yas Island', 'Saadiyat Island', 'Abu Dhabi Bus Terminal'],
  },
  {
    id: 'doh',
    code: 'DOH',
    name: 'Hamad International Airport',
    city: 'Doha',
    country: 'Qatar',
    region: 'Middle East',
    flag: '🇶🇦',
    defaultTerminal: 'Main Terminal',
    defaultMetroStation: 'Hamad Airport Red Line Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Souq Waqif', 'West Bay', 'Katara Cultural Village', 'The Pearl Qatar'],
  },

  // EUROPE
  {
    id: 'lhr',
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    flag: '🇬🇧',
    defaultTerminal: 'Terminal 5',
    defaultMetroStation: 'Heathrow Terminal 5 Underground Station',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['London Paddington', 'Piccadilly Circus', 'King Cross St. Pancras', 'Victoria Station', 'Canary Wharf'],
  },
  {
    id: 'cdg',
    code: 'CDG',
    name: 'Paris Charles de Gaulle Airport',
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    flag: '🇫🇷',
    defaultTerminal: 'Terminal 2E',
    defaultMetroStation: 'Aéroport CDG 2 TGV RER Station',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Gare du Nord', 'Châtelet - Les Halles', 'Saint-Michel Notre-Dame', 'Opéra Paris'],
  },
  {
    id: 'fra',
    code: 'FRA',
    name: 'Frankfurt Airport',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Europe',
    flag: '🇩🇪',
    defaultTerminal: 'Terminal 1',
    defaultMetroStation: 'Frankfurt Regional Station (S-Bahn)',
    transitModes: ['metro', 'skytrain', 'cab'],
    destinations: ['Frankfurt Hauptbahnhof', 'Hauptwache', 'Messe Frankfurt', 'Wiesbaden Hbf'],
  },
  {
    id: 'ams',
    code: 'AMS',
    name: 'Amsterdam Airport Schiphol',
    city: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    flag: '🇳🇱',
    defaultTerminal: 'Main Plaza',
    defaultMetroStation: 'Schiphol Railway Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Amsterdam Centraal', 'Amsterdam Zuid', 'Utrecht Centraal', 'Leiden Centraal'],
  },

  // ASIA
  {
    id: 'sin',
    code: 'SIN',
    name: 'Singapore Changi Airport',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    flag: '🇸🇬',
    defaultTerminal: 'Terminal 3',
    defaultMetroStation: 'Changi Airport MRT Station (CG2)',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Marina Bay Sands', 'Orchard Road', 'City Hall MRT', 'Bugis', 'Sentosa Island Link'],
  },
  {
    id: 'hkg',
    code: 'HKG',
    name: 'Hong Kong International Airport',
    city: 'Hong Kong',
    country: 'Hong Kong SAR',
    region: 'Asia',
    flag: '🇭🇰',
    defaultTerminal: 'Terminal 1',
    defaultMetroStation: 'Airport Station (Airport Express)',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Hong Kong Central Station', 'Kowloon Station', 'Tsing Yi Station', 'Tsim Sha Tsui'],
  },
  {
    id: 'hnd',
    code: 'HND',
    name: 'Tokyo Haneda Airport',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    flag: '🇯🇵',
    defaultTerminal: 'Terminal 3',
    defaultMetroStation: 'Haneda Airport Terminal 3 Station (Keikyu/Monorail)',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Shinagawa Station', 'Tokyo Station', 'Shinjuku Station', 'Shibuya Station', 'Hamamatsucho'],
  },
  {
    id: 'icn',
    code: 'ICN',
    name: 'Seoul Incheon International Airport',
    city: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    flag: '🇰🇷',
    defaultTerminal: 'Terminal 1',
    defaultMetroStation: 'Incheon Airport T1 AREX Station',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Seoul Station Express', 'Hongik University', 'Gimpo Airport', 'Gangnam Station'],
  },

  // NORTH AMERICA
  {
    id: 'jfk',
    code: 'JFK',
    name: 'John F. Kennedy International Airport',
    city: 'New York',
    country: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    defaultTerminal: 'Terminal 4',
    defaultMetroStation: 'JFK AirTrain Jamaica Station',
    transitModes: ['metro', 'skytrain', 'bus', 'cab'],
    destinations: ['Penn Station Manhattan', 'Grand Central', 'Times Square', 'Lower Manhattan', 'Brooklyn Downtown'],
  },
  {
    id: 'sfo',
    code: 'SFO',
    name: 'San Francisco International Airport',
    city: 'San Francisco',
    country: 'United States',
    region: 'North America',
    flag: '🇺🇸',
    defaultTerminal: 'International Terminal',
    defaultMetroStation: 'SFO BART Station',
    transitModes: ['metro', 'skytrain', 'cab'],
    destinations: ['Powell Street SF', 'Embarcadero', 'Downtown Oakland', 'Berkeley'],
  },
  {
    id: 'yyz',
    code: 'YYZ',
    name: 'Toronto Pearson International Airport',
    city: 'Toronto',
    country: 'Canada',
    region: 'North America',
    flag: '🇨🇦',
    defaultTerminal: 'Terminal 1',
    defaultMetroStation: 'Pearson UP Express Station',
    transitModes: ['metro', 'skytrain', 'cab'],
    destinations: ['Union Station Toronto', 'Bloor Station', 'Weston Station'],
  },

  // AUSTRALIA
  {
    id: 'syd',
    code: 'SYD',
    name: 'Sydney Kingsford Smith Airport',
    city: 'Sydney',
    country: 'Australia',
    region: 'Australia',
    flag: '🇦🇺',
    defaultTerminal: 'International Terminal T1',
    defaultMetroStation: 'International Airport Station',
    transitModes: ['metro', 'bus', 'cab'],
    destinations: ['Central Station Sydney', 'Circular Quay', 'Town Hall', 'Wynyard'],
  },
  {
    id: 'mel',
    code: 'MEL',
    name: 'Melbourne Tullamarine Airport',
    city: 'Melbourne',
    country: 'Australia',
    region: 'Australia',
    flag: '🇦🇺',
    defaultTerminal: 'Terminal 2',
    defaultMetroStation: 'SkyBus Express Hub',
    transitModes: ['bus', 'cab'],
    destinations: ['Southern Cross Station', 'Flinders Street', 'Southbank', 'Docklands'],
  },
];

export const TRANSIT_MODES: TransitModeInfo[] = [
  { id: 'metro', label: 'Airport Metro / Rail', icon: '🚆', description: 'High-speed express trains & rapid transit', tag: 'Fastest' },
  { id: 'bus', label: 'Shuttle / Pushpak Bus', icon: '🚌', description: 'Direct AC coach & airport shuttle buses', tag: 'Economical' },
  { id: 'skytrain', label: 'Terminal Skytrain / APM', icon: '🚝', description: 'Automated people movers & inter-terminal transit', tag: 'Free' },
  { id: 'cab', label: 'Cab & Ride Hail', icon: '🚖', description: 'On-demand taxis, Uber, Ola & premium cabs', tag: 'Door to Door' },
  { id: 'walking', label: 'Terminal Transfer', icon: '🚶', description: 'Indoor walking guidance to transit stations', tag: 'Eco Friendly' },
];

export const PUSHPAK_BUSES: BusInfo[] = [
  { id: '1', name: 'Pushpak AJ', departure: '10:30 AM', eta: '35 mins', seats: 'Available' },
  { id: '2', name: 'Pushpak AC', departure: '11:15 AM', eta: '45 mins', seats: 'Filling Fast' },
  { id: '3', name: 'Pushpak AM', departure: '12:00 PM', eta: '30 mins', seats: 'Available' },
  { id: '4', name: 'Pushpak AS', departure: '12:45 PM', eta: '50 mins', seats: 'Housefull' },
  { id: '5', name: 'Pushpak AB', departure: '01:30 PM', eta: '40 mins', seats: 'Available' },
];

export const getMetroServicesForAirport = (airportId: string, destination: string): MetroService[] => {
  const currencyMap: Record<string, string> = {
    hyd: '₹', del: '₹', bom: '₹', blr: '₹', maa: '₹', cok: '₹', amd: '₹', lko: '₹', ccu: '₹', gox: '₹',
    dxb: 'AED ', auh: 'AED ', doh: 'QAR ',
    lhr: '£', cdg: '€', fra: '€', ams: '€',
    sin: 'S$', hkg: 'HK$', hnd: '¥', icn: '₩',
    jfk: '$', sfo: '$', yyz: 'CA$',
    syd: 'A$', mel: 'A$'
  };
  const sym = currencyMap[airportId] || '₹';

  const airportConfig: Record<string, {
    expressName: string;
    expressCode: string;
    rapidName: string;
    rapidCode: string;
    stationsExpress: string[];
    stationsRapid: string[];
    coordsExpress: [number, number][];
    coordsRapid: [number, number][];
    fromStation: string;
    city: string;
  }> = {
    hyd: {
      expressName: 'Hyderabad Airport Express',
      expressCode: 'HYD-EXP',
      rapidName: 'Hyderabad Blue Line Metro',
      rapidCode: 'HYD-BLU',
      fromStation: 'RGIA Airport Station',
      city: 'Hyderabad',
      stationsExpress: ['RGIA Airport Terminal', 'Gachibowli Junction', 'Cyber Towers (Hitech)', 'Ameerpet Interchange', destination || 'Miyapur'],
      stationsRapid: ['RGIA Airport Terminal', 'Shamshabad', 'Faluknuma', 'MGBS Koti', 'Ameerpet', destination || 'Miyapur'],
      coordsExpress: [
        [17.2403, 78.4294],
        [17.4401, 78.3489],
        [17.4504, 78.3808],
        [17.4375, 78.4482],
        [17.4968, 78.3614]
      ],
      coordsRapid: [
        [17.2403, 78.4294],
        [17.2510, 78.4350],
        [17.3320, 78.4710],
        [17.3780, 78.4810],
        [17.4375, 78.4482],
        [17.4968, 78.3614]
      ]
    },
    del: {
      expressName: 'Delhi Airport Express Line (Orange Line)',
      expressCode: 'DEL-ORG',
      rapidName: 'Delhi Blue Line Metro',
      rapidCode: 'DEL-BLU',
      fromStation: 'IGI Airport T3 Station',
      city: 'Delhi',
      stationsExpress: ['IGI Airport T3', 'Delhi Aerocity', 'Dhaula Kuan', 'Shivaji Stadium', destination || 'New Delhi Railway Station'],
      stationsRapid: ['IGI Airport T3', 'Dwarka Sector 21', 'Janakpuri West', 'Rajiv Chowk', destination || 'New Delhi Railway Station'],
      coordsExpress: [
        [28.5562, 77.0867],
        [28.5492, 77.1212],
        [28.5919, 77.1616],
        [28.6291, 77.2140],
        [28.6429, 77.2197]
      ],
      coordsRapid: [
        [28.5562, 77.0867],
        [28.5520, 77.0580],
        [28.6290, 77.0780],
        [28.6328, 77.2195],
        [28.6429, 77.2197]
      ]
    },
    bom: {
      expressName: 'Mumbai Metro Line 3 (Aqua Line)',
      expressCode: 'BOM-AQUA',
      rapidName: 'Mumbai Metro Line 1 (Red)',
      rapidCode: 'BOM-LINE1',
      fromStation: 'CSMIA T2 Metro Station',
      city: 'Mumbai',
      stationsExpress: ['CSMIA T2 Airport Hub', 'Marol Naka', 'BKC Commercial Hub', 'Worli Metro', destination || 'Andheri'],
      stationsRapid: ['CSMIA T2 Airport Hub', 'Western Express Highway', 'Andheri East', 'Ghatkopar', destination || 'Bandra'],
      coordsExpress: [
        [19.0896, 72.8656],
        [19.1171, 72.8860],
        [19.0657, 72.8686],
        [19.0176, 72.8180],
        [19.1197, 72.8464]
      ],
      coordsRapid: [
        [19.0896, 72.8656],
        [19.1158, 72.8550],
        [19.1197, 72.8464],
        [19.0860, 72.9081],
        [19.0596, 72.8295]
      ]
    },
    blr: {
      expressName: 'Namma Metro Airport Line (Blue Line)',
      expressCode: 'BLR-BLUE',
      rapidName: 'Namma Metro Purple Line Shuttle',
      rapidCode: 'BLR-PUR',
      fromStation: 'KIA Airport Station',
      city: 'Bengaluru',
      stationsExpress: ['KIA Airport Terminal', 'Trumpet Flyover', 'Yelahanka Satellite', 'Hebbal Hub', destination || 'MG Road'],
      stationsRapid: ['KIA Airport Terminal', 'Doddajala', 'Kogilu Cross', 'Kasturi Nagar', destination || 'Indiranagar'],
      coordsExpress: [
        [13.1986, 77.7066],
        [13.1678, 77.6360],
        [13.1007, 77.5963],
        [13.0359, 77.5970],
        [12.9756, 77.6066]
      ],
      coordsRapid: [
        [13.1986, 77.7066],
        [13.1760, 77.6620],
        [13.1180, 77.6180],
        [13.0180, 77.6520],
        [12.9784, 77.6408]
      ]
    },
    maa: {
      expressName: 'Chennai Airport Metro Direct',
      expressCode: 'MAA-DIR',
      rapidName: 'Chennai Metro Blue Line',
      rapidCode: 'MAA-BLU',
      fromStation: 'Chennai Airport Station',
      city: 'Chennai',
      stationsExpress: ['Chennai Airport Terminal', 'Guindy Station', 'Saidapet Hub', 'Nandanam', destination || 'Central Railway Station'],
      stationsRapid: ['Chennai Airport Terminal', 'Meenambakkam', 'Ekkatuthangal', 'Koyambedu', destination || 'T Nagar'],
      coordsExpress: [
        [12.9941, 80.1709],
        [13.0067, 80.2021],
        [13.0245, 80.2223],
        [13.0305, 80.2410],
        [13.0827, 80.2757]
      ],
      coordsRapid: [
        [12.9941, 80.1709],
        [12.9870, 80.1760],
        [13.0200, 80.1970],
        [13.0732, 80.1942],
        [13.0418, 80.2341]
      ]
    },
    cok: {
      expressName: 'Kochi Metro Airport Feeder',
      expressCode: 'COK-FEED',
      rapidName: 'Kochi Metro Line 1',
      rapidCode: 'COK-L1',
      fromStation: 'Aluva Metro Station Link',
      city: 'Kochi',
      stationsExpress: ['Cochin Airport Terminal', 'Aluva Metro Terminal', 'Edapally Junction', 'Palarivattom', destination || 'MG Road Kochi'],
      stationsRapid: ['Cochin Airport Terminal', 'Angamaly Link', 'Aluva', 'Companypady', destination || 'Vytilla Mobility Hub'],
      coordsExpress: [
        [10.1520, 76.3922],
        [10.1098, 76.3571],
        [10.0261, 76.3082],
        [10.0076, 76.3050],
        [9.9674, 76.2849]
      ],
      coordsRapid: [
        [10.1520, 76.3922],
        [10.1900, 76.3800],
        [10.1098, 76.3571],
        [10.0820, 76.3400],
        [9.9667, 76.3190]
      ]
    },
    dxb: {
      expressName: 'Dubai Metro Red Line Express',
      expressCode: 'DXB-RED',
      rapidName: 'Dubai Metro Green Line Transfer',
      rapidCode: 'DXB-GRN',
      fromStation: 'DXB Airport T3 Station',
      city: 'Dubai',
      stationsExpress: ['DXB Airport T3 Station', 'GGICO', 'Deira City Centre', 'Union Interchange', destination || 'Burj Khalifa / Dubai Mall'],
      stationsRapid: ['DXB Airport T3 Station', 'Airport Terminal 1', 'Al Rigga', 'BurJuman', destination || 'Dubai Marina'],
      coordsExpress: [
        [25.2532, 55.3657],
        [25.2530, 55.3400],
        [25.2570, 55.3300],
        [25.2670, 55.3120],
        [25.1972, 55.2744]
      ],
      coordsRapid: [
        [25.2532, 55.3657],
        [25.2470, 55.3520],
        [25.2630, 55.3210],
        [25.2530, 55.3010],
        [25.0773, 55.1404]
      ]
    },
    lhr: {
      expressName: 'Heathrow Express Non-Stop',
      expressCode: 'LHR-HEX',
      rapidName: 'Elizabeth Line / Piccadilly Underground',
      rapidCode: 'LHR-ELIZ',
      fromStation: 'Heathrow Terminal 5 Station',
      city: 'London',
      stationsExpress: ['Heathrow Terminal 5', 'Heathrow Central T2/T3', 'Acton Main Line', destination || 'London Paddington'],
      stationsRapid: ['Heathrow Terminal 5', 'Terminals 2 & 3', 'Hammersmith', 'Piccadilly Circus', destination || 'Kings Cross'],
      coordsExpress: [
        [51.4700, -0.4897],
        [51.4719, -0.4526],
        [51.5170, -0.2670],
        [51.5167, -0.1756]
      ],
      coordsRapid: [
        [51.4700, -0.4897],
        [51.4719, -0.4526],
        [51.4930, -0.2240],
        [51.5100, -0.1340],
        [51.5308, -0.1238]
      ]
    },
    sin: {
      expressName: 'Changi Airport MRT Express (East-West Line)',
      expressCode: 'SIN-MRT',
      rapidName: 'Downtown Line Airport Link',
      rapidCode: 'SIN-DTL',
      fromStation: 'Changi Airport MRT Station (CG2)',
      city: 'Singapore',
      stationsExpress: ['Changi Airport MRT (CG2)', 'Expo MRT (CG1)', 'Tanah Merah (EW4)', 'Bugis MRT', destination || 'Marina Bay Sands'],
      stationsRapid: ['Changi Airport MRT (CG2)', 'Expo MRT', 'Tampines', 'MacPherson', destination || 'Orchard Road'],
      coordsExpress: [
        [1.3573, 103.9877],
        [1.3353, 103.9617],
        [1.3273, 103.9464],
        [1.2990, 103.8557],
        [1.2830, 103.8607]
      ],
      coordsRapid: [
        [1.3573, 103.9877],
        [1.3353, 103.9617],
        [1.3530, 103.9450],
        [1.3260, 103.8900],
        [1.3040, 103.8320]
      ]
    },
    jfk: {
      expressName: 'JFK AirTrain + LIRR Direct Express',
      expressCode: 'JFK-LIRR',
      rapidName: 'JFK AirTrain + NYC Subway Line A/E',
      rapidCode: 'JFK-SUBWAY',
      fromStation: 'JFK AirTrain Jamaica Station Hub',
      city: 'New York',
      stationsExpress: ['JFK Terminal 4 AirTrain', 'Jamaica Station Transit Hub', 'Woodside LIRR', destination || 'Penn Station Manhattan'],
      stationsRapid: ['JFK Terminal 4 AirTrain', 'Howard Beach A Line', 'Jay St-MetroTech', 'West 4th St', destination || 'Times Square'],
      coordsExpress: [
        [40.6444, -73.7827],
        [40.6994, -73.8080],
        [40.7458, -73.9030],
        [40.7506, -73.9935]
      ],
      coordsRapid: [
        [40.6444, -73.7827],
        [40.6605, -73.8300],
        [40.6920, -73.9870],
        [40.7310, -74.0000],
        [40.7580, -73.9855]
      ]
    },
    syd: {
      expressName: 'Sydney Airport Rail Link (T8 Airport Line)',
      expressCode: 'SYD-T8',
      rapidName: 'Sydney Metro City Connection',
      rapidCode: 'SYD-METRO',
      fromStation: 'International Airport Station',
      city: 'Sydney',
      stationsExpress: ['Sydney Int Airport T1', 'Domestic Airport T2/T3', 'Mascot Station', 'Green Square', destination || 'Central Station Sydney'],
      stationsRapid: ['Sydney Int Airport T1', 'Wolli Creek', 'Sydenham', 'Waterloo', destination || 'Circular Quay'],
      coordsExpress: [
        [-33.9351, 151.1662],
        [-33.9333, 151.1804],
        [-33.9238, 151.1969],
        [-33.9060, 151.2030],
        [-33.8832, 151.2070]
      ],
      coordsRapid: [
        [-33.9351, 151.1662],
        [-33.9290, 151.1520],
        [-33.9160, 151.1660],
        [-33.8990, 151.2000],
        [-33.8610, 151.2100]
      ]
    }
  };

  const cfg = airportConfig[airportId] || {
    expressName: `${airportId.toUpperCase()} Airport Express Line`,
    expressCode: `${airportId.toUpperCase()}-EXP`,
    rapidName: `${airportId.toUpperCase()} City Metro Line`,
    rapidCode: `${airportId.toUpperCase()}-MET`,
    fromStation: `${airportId.toUpperCase()} Airport Central Station`,
    city: 'City Hub',
    stationsExpress: [`${airportId.toUpperCase()} Airport Terminal`, 'Airport Exchange', 'City Concourse', destination || 'City Centre Station'],
    stationsRapid: [`${airportId.toUpperCase()} Airport Terminal`, 'South Transfer', 'North Junction', destination || 'City Centre Station'],
    coordsExpress: [
      [17.2403, 78.4294],
      [17.3800, 78.4500],
      [17.4300, 78.4400],
      [17.4900, 78.3600]
    ],
    coordsRapid: [
      [17.2403, 78.4294],
      [17.2600, 78.4300],
      [17.3500, 78.4600],
      [17.4900, 78.3600]
    ]
  };

  return [
    {
      id: `${airportId}-express`,
      lineName: cfg.expressName,
      lineCode: cfg.expressCode,
      trainType: 'Non-stop Express',
      nextTrainMinutes: 3,
      etaMinutes: 22,
      fare: `${sym}60`,
      status: 'On Time',
      color: '#3b82f6',
      route: cfg.stationsExpress,
      coordinates: cfg.coordsExpress,
      frequency: 'Every 8 mins',
      speedKmh: 110,
      totalStations: cfg.stationsExpress.length,
      fromStation: cfg.fromStation,
      toStation: destination || cfg.stationsExpress[cfg.stationsExpress.length - 1],
      airportCode: airportId.toUpperCase(),
      city: cfg.city,
    },
    {
      id: `${airportId}-rapid`,
      lineName: cfg.rapidName,
      lineCode: cfg.rapidCode,
      trainType: 'Rapid Transit',
      nextTrainMinutes: 8,
      etaMinutes: 31,
      fare: `${sym}40`,
      status: 'On Time',
      color: '#06b6d4',
      route: cfg.stationsRapid,
      coordinates: cfg.coordsRapid,
      frequency: 'Every 10 mins',
      speedKmh: 80,
      totalStations: cfg.stationsRapid.length,
      fromStation: cfg.fromStation,
      toStation: destination || cfg.stationsRapid[cfg.stationsRapid.length - 1],
      airportCode: airportId.toUpperCase(),
      city: cfg.city,
    },
    {
      id: `${airportId}-interterminal`,
      lineName: 'Terminal Shuttle Express',
      lineCode: 'SHUTTLE-T',
      trainType: 'Automated Skytrain',
      nextTrainMinutes: 2,
      etaMinutes: 6,
      fare: 'Free Transfer',
      status: 'Departing Soon',
      color: '#a855f7',
      route: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Airport Metro Hub'],
      coordinates: [
        [cfg.coordsExpress[0][0], cfg.coordsExpress[0][1]],
        [cfg.coordsExpress[0][0] + 0.005, cfg.coordsExpress[0][1] + 0.005],
        [cfg.coordsExpress[0][0] + 0.010, cfg.coordsExpress[0][1] + 0.008],
        [cfg.coordsExpress[0][0] + 0.012, cfg.coordsExpress[0][1] + 0.012]
      ],
      frequency: 'Continuous (2 mins)',
      speedKmh: 45,
      totalStations: 4,
      fromStation: 'Arrivals Platform',
      toStation: 'Metro Connection Hub',
      airportCode: airportId.toUpperCase(),
      city: cfg.city,
    },
  ];
};

export const getMultiModalOptions = (airport: Airport, dest: string): MultiModalOption[] => {
  const isIndia = airport.region === 'India';
  return [
    {
      mode: 'metro',
      title: `${airport.code} Express Metro`,
      fare: isIndia ? '₹60' : '$8.50',
      etaMinutes: 22,
      distanceKm: 18,
      icon: '🚆',
      tag: 'Recommended',
      color: 'from-blue-600 to-cyan-500',
      notes: 'Direct express line with dedicated luggage racks & WiFi.',
    },
    {
      mode: 'bus',
      title: `${airport.code} Airport Coach / Pushpak`,
      fare: isIndia ? '₹250' : '$15.00',
      etaMinutes: 38,
      distanceKm: 20,
      icon: '🚌',
      tag: 'AC Deluxe',
      color: 'from-emerald-600 to-teal-500',
      notes: 'Frequent AC luxury coaches directly to city hotel hubs.',
    },
    {
      mode: 'cab',
      title: 'Airport Taxi / Ride Hail',
      fare: isIndia ? '₹720' : '$45.00',
      etaMinutes: 32,
      distanceKm: 19,
      icon: '🚖',
      tag: 'Door to Door',
      color: 'from-amber-500 to-orange-600',
      notes: 'On-demand pick-up at designated Arrival Taxi bays.',
    },
    {
      mode: 'walking',
      title: 'Inter-Terminal Skywalk',
      fare: 'Free',
      etaMinutes: 7,
      distanceKm: 0.4,
      icon: '🚶',
      tag: 'Air-conditioned',
      color: 'from-purple-600 to-pink-500',
      notes: 'Indoor travelator connection directly to Metro Station.',
    },
  ];
};

export const getAITransitRecommendation = (airportName: string, dest: string): AITransitRecommendation => {
  return {
    recommendedMode: 'Airport Metro Express',
    title: 'Fastest & Most Economical Route',
    reason: `Airport Metro Line offers direct, traffic-free connection from ${airportName} to ${dest || 'City Centre'}.`,
    nextDepartureInMins: 3,
    expectedArrival: '4:18 PM',
    alternativeText: 'Alternative: Airport Shuttle Coach departing in 12 mins.',
  };
};

export const getTerminalTransferGuidance = (airportCode: string): TerminalTransferGuidance => {
  return {
    terminal: 'Terminal 3 Arrivals',
    metroStation: `${airportCode} Airport Metro Station`,
    distanceMeters: 420,
    walkingTimeMins: 6,
    level: 'Lower Ground (Concourse Level B)',
    elevatorAvailable: true,
    wheelchairAccessible: true,
  };
};

export const NOTIFICATION_PRESETS: TransitNotification[] = [
  {
    id: 'n1',
    title: 'Next Metro Arriving',
    message: 'Express Train EXP-01 arriving at Platform 2 in 3 minutes.',
    timestamp: 'Just now',
    type: 'success',
    read: false,
  },
  {
    id: 'n2',
    title: 'Platform Change Alert',
    message: 'Blue Line train to City Centre moved from Platform 1 to Platform 3.',
    timestamp: '2 mins ago',
    type: 'warning',
    read: false,
  },
  {
    id: 'n3',
    title: 'Terminal Shuttle Approaching',
    message: 'Skytrain Loop Coach #4 approaching T3 Arrivals gate.',
    timestamp: '5 mins ago',
    type: 'info',
    read: true,
  },
  {
    id: 'n4',
    title: 'Hyderabad Pushpak Update',
    message: 'Pushpak AJ live tracking is active. Driver unit pinged via Telegram.',
    timestamp: '8 mins ago',
    type: 'info',
    read: true,
  },
];
