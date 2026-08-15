import { Request, Response } from 'express';
import axios from 'axios';
import OpenAI from 'openai';

interface BusOfficialWebsite {
  url: string;
  isLiveTrackingAvailable: boolean;
  note?: string;
}

interface BusOfficialApp {
  name: string;
  playStoreUrl: string;
  packageName?: string;
  description: string;
  recommendationPrompt: string;
}

interface GroundedBusData {
  hasBusService: boolean;
  statusMessage: string;
  serviceName?: string;
  operator?: string;
  airportStops?: string[];
  fareRange?: string;
  operatingHours?: string;
  frequency?: string;
  travelTime?: string;
  officialWebsite?: BusOfficialWebsite;
  officialApp?: BusOfficialApp;
  noBusDetails?: {
    message: string;
    alternatives: string[];
  };
  sourcesConflict?: boolean;
  sourcesConflictNote?: string;
  notes?: string;
}

// In-memory cache with 30-minute TTL
const busCache: Record<string, { data: GroundedBusData; timestamp: string; expiresAt: number }> = {};
const CACHE_TTL_MS = 30 * 60 * 1000;

// ── Verified Public Transport Grounding Baseline ──────────────────────────────
const BUS_GROUNDING_DB: Record<string, GroundedBusData> = {
  HYD: {
    hasBusService: true,
    statusMessage: 'Airport Bus Service Available',
    serviceName: 'Pushpak Airport Liner',
    operator: 'TGSRTC (Telangana State Road Transport Corporation)',
    airportStops: [
      'RGIA Terminal Arrivals Ramp',
      'Pariwarhabad / Shamshabad',
      'Mehdipatnam Hub',
      'Ameerpet Metro Junction',
      'Miyapur / JNTU',
      'Secunderabad JBS',
    ],
    fareRange: '₹150 – ₹350',
    operatingHours: '24×7',
    frequency: 'Every 15–30 minutes',
    travelTime: '45–90 minutes depending on traffic',
    officialWebsite: {
      url: 'https://www.tgsrtc.telangana.gov.in',
      isLiveTrackingAvailable: false,
      note: 'An official public live-tracking website is not available. The website below provides official routes, schedules, and service information.',
    },
    officialApp: {
      name: 'TGSRTC Gamyam',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.tgsrtc.gamyam',
      packageName: 'com.tgsrtc.gamyam',
      description: 'This app provides official airport bus routes, timings, and service information.',
      recommendationPrompt: 'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.',
    },
  },
  BLR: {
    hasBusService: true,
    statusMessage: 'Airport Bus Service Available',
    serviceName: 'Vayu Vajra AC Airport Service',
    operator: 'BMTC (Bangalore Metropolitan Transport Corporation)',
    airportStops: [
      'KIA Terminal Arrivals Bus Bay',
      'Hebbal Flyover',
      'Mekhri Circle',
      'Majestic (BSK / Kempegowda Bus Station)',
      'Electronic City Phase 1',
      'Whitefield TTMC',
    ],
    fareRange: '₹170 – ₹320',
    operatingHours: '24×7',
    frequency: 'Every 15–30 minutes',
    travelTime: '60–120 minutes depending on traffic',
    officialWebsite: {
      url: 'https://mybmtc.karnataka.gov.in',
      isLiveTrackingAvailable: true,
    },
    officialApp: {
      name: 'Namma BMTC',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.bmtc.nammabmtc',
      packageName: 'com.bmtc.nammabmtc',
      description: 'This app provides official airport bus routes, timings, and service information.',
      recommendationPrompt: 'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.',
    },
  },
  DEL: {
    hasBusService: true,
    statusMessage: 'Airport Bus Service Available',
    serviceName: 'DTC Airport Express Bus',
    operator: 'Delhi Transport Corporation (DTC) / DIMTS',
    airportStops: [
      'IGI T3 Arrivals Bus Desk',
      'IGI T1 Domestic Arrivals',
      'Connaught Place',
      'New Delhi Railway Station',
      'ISBT Kashmere Gate',
    ],
    fareRange: '₹50 – ₹200',
    operatingHours: '24×7',
    frequency: 'Every 20–30 minutes',
    travelTime: '45–75 minutes',
    officialWebsite: {
      url: 'https://dtc.delhi.gov.in',
      isLiveTrackingAvailable: true,
    },
    officialApp: {
      name: 'One Delhi',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.onedelhi',
      packageName: 'com.onedelhi',
      description: 'This app provides official airport bus routes, timings, and service information.',
      recommendationPrompt: 'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.',
    },
  },
  BOM: {
    hasBusService: true,
    statusMessage: 'Airport Bus Service Available',
    serviceName: 'BEST Airport Express Bus',
    operator: 'Brihanmumbai Electric Supply and Transport (BEST)',
    airportStops: [
      'CSMIA T2 International Terminal Arrivals',
      'CSMIA T1 Domestic Terminal',
      'Andheri Station East',
      'Bandra Kurla Complex (BKC)',
      'South Mumbai / Colaba',
    ],
    fareRange: '₹75 – ₹250',
    operatingHours: '05:00 AM – 11:30 PM',
    frequency: 'Every 20–30 minutes',
    travelTime: '45–90 minutes',
    officialWebsite: {
      url: 'https://bestundertaking.net',
      isLiveTrackingAvailable: true,
    },
    officialApp: {
      name: 'Chalo BEST',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.chalo.best',
      packageName: 'com.chalo.best',
      description: 'This app provides official airport bus routes, timings, and service information.',
      recommendationPrompt: 'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.',
    },
  },
  MAA: {
    hasBusService: true,
    statusMessage: 'Airport Bus Service Available',
    serviceName: 'MTC Airport Bus Service',
    operator: 'Metropolitan Transport Corporation (MTC Chennai)',
    airportStops: [
      'Chennai Airport Arrivals Bay',
      'Guindy Industrial Estate',
      'T. Nagar',
      'Chennai Central Station',
      'Koyambedu CMBT',
    ],
    fareRange: '₹50 – ₹150',
    operatingHours: '05:00 AM – 11:00 PM',
    frequency: 'Every 20–45 minutes',
    travelTime: '40–75 minutes',
    officialWebsite: {
      url: 'https://mtcbus.tn.gov.in',
      isLiveTrackingAvailable: false,
      note: 'An official public live-tracking website is not available. The website below provides official routes, schedules, and service information.',
    },
    officialApp: {
      name: 'Chalo MTC',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.chalo.app',
      packageName: 'com.chalo.app',
      description: 'This app provides official airport bus routes, timings, and service information.',
      recommendationPrompt: 'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.',
    },
  },
  CCU: {
    hasBusService: true,
    statusMessage: 'Airport Bus Service Available',
    serviceName: 'WBTC Airport Express Bus',
    operator: 'West Bengal Transport Corporation (WBTC)',
    airportStops: [
      'Kolkata Airport Gate No. 1',
      'VIP Road Junction',
      'Ultadanga',
      'Esplanade Bus Station',
      'Howrah Railway Station',
    ],
    fareRange: '₹60 – ₹180',
    operatingHours: '05:30 AM – 10:30 PM',
    frequency: 'Every 20–30 minutes',
    travelTime: '45–75 minutes',
    officialWebsite: {
      url: 'https://wbtc.co.in',
      isLiveTrackingAvailable: true,
    },
    officialApp: {
      name: 'Pathadisha',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.pathadisha.app',
      packageName: 'com.pathadisha.app',
      description: 'This app provides official airport bus routes, timings, and service information.',
      recommendationPrompt: 'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.',
    },
  },
};

// ── Serper Search Helper ──────────────────────────────────────────────────────
async function fetchSerperBusResults(query: string): Promise<string> {
  const serperKey = process.env.SERPER_API_KEY;
  if (!serperKey) return '';

  try {
    const resp = await axios.post(
      'https://google.serper.dev/search',
      { q: query, num: 6, gl: 'in', hl: 'en' },
      {
        headers: {
          'X-API-KEY': serperKey,
          'Content-Type': 'application/json',
        },
        timeout: 7000,
      }
    );
    const organic = resp.data?.organic || [];
    return organic
      .map((item: any) => `Title: ${item.title}\nSnippet: ${item.snippet}\nLink: ${item.link}`)
      .join('\n\n');
  } catch (err: any) {
    console.error('[AirportBusController] Serper search error:', err.message);
    return '';
  }
}

// ── LLM Verification Function ────────────────────────────────────────────────
async function verifyBusServiceWithLLM(
  airportName: string,
  code: string,
  city: string,
  country: string,
  snippets: string
): Promise<GroundedBusData | null> {
  const openRouterKey = process.env.LLM_API || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!openRouterKey) return null;

  const client = new OpenAI({
    apiKey: openRouterKey,
    baseURL: (process.env.LLM_API || process.env.OPENROUTER_API_KEY) ? 'https://openrouter.ai/api/v1' : undefined,
  });

  const systemPrompt = `You are Google AI Mode Transit Intelligence Assistant. Extract and verify official public airport bus service data for airports.

CRITICAL GROUNDING RULES:
1. Verify if there is an official public airport bus service connecting this airport to the city.
2. If NO official public bus service exists or can be confirmed, set hasBusService to false and provide alternative transit options. Do NOT fabricate bus routes, operators, or apps.
3. For official website and official app: provide verified transport corporation website and Play Store URL.
4. If an official live tracking website does NOT exist, set isLiveTrackingAvailable to false and include note: "An official public live-tracking website is not available. The website below provides official routes, schedules, and service information."
5. If sources disagree, set sourcesConflict to true and note: "Different sources report different information; the official transport authority should be treated as the most reliable source."
6. Output strict valid JSON matching the schema without markdown formatting outside standard JSON.`;

  const userPrompt = `Airport: ${airportName} (${code}), City: ${city}, Country: ${country}

Live Search Results:
${snippets || 'No live snippets found.'}

Format response in this exact JSON schema:
{
  "hasBusService": true/false,
  "statusMessage": "Airport Bus Service Available" OR "No verified public airport bus service could be confirmed for this airport at the moment.",
  "serviceName": "Official service name e.g. Pushpak Airport Liner",
  "operator": "Official transport corporation name e.g. TGSRTC",
  "airportStops": ["Terminal Arrivals Ramp", "City Hub 1", "City Hub 2"],
  "fareRange": "Approximate fare range e.g. ₹150 - ₹350",
  "operatingHours": "Operating hours e.g. 24x7",
  "frequency": "Frequency e.g. Every 15-30 minutes",
  "travelTime": "Approximate travel time e.g. 45-75 minutes",
  "officialWebsite": {
    "url": "https://www.tgsrtc.telangana.gov.in",
    "isLiveTrackingAvailable": false,
    "note": "An official public live-tracking website is not available. The website below provides official routes, schedules, and service information."
  },
  "officialApp": {
    "name": "Official app name e.g. TGSRTC Gamyam",
    "playStoreUrl": "https://play.google.com/store/apps/details?id=...",
    "packageName": "Package name if known",
    "description": "This app provides official airport bus routes, timings, and service information.",
    "recommendationPrompt": "For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store."
  },
  "noBusDetails": {
    "message": "No verified public airport bus service could be confirmed for this airport at the moment.",
    "alternatives": ["Metro / Suburban Rail", "Pre-paid airport taxis", "Rideshare apps (Ola / Uber)"]
  },
  "sourcesConflict": false,
  "sourcesConflictNote": "Different sources report different information; the official transport authority should be treated as the most reliable source."
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const raw = response.choices?.[0]?.message?.content || '{}';
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (typeof parsed.hasBusService === 'boolean') {
      return parsed as GroundedBusData;
    }
  } catch (err: any) {
    console.error('[AirportBusController] LLM verification error:', err.message);
  }

  return null;
}

// ── Main Controller ───────────────────────────────────────────────────────────
export async function investigateBusService(req: Request, res: Response) {
  const now = Date.now();
  const checkedAt = new Date().toISOString();

  try {
    const { airportName, airportCode, city, country } = req.body;

    if (!airportName || !airportCode) {
      return res.status(400).json({ success: false, error: 'airportName and airportCode are required.' });
    }

    const code = (airportCode as string).toUpperCase().trim();

    // 1. Check cache
    const cached = busCache[code];
    if (cached && cached.expiresAt > now) {
      console.log(`[AirportBusController] Returning cached result for ${code}`);
      return res.status(200).json({
        success: true,
        ...cached.data,
        airportName,
        airportCode: code,
        city,
        country: country || 'India',
        lastUpdated: cached.timestamp,
        cached: true,
      });
    }

    console.log(`[AirportBusController] Investigating bus service for ${airportName} (${code}), ${city}`);

    // 2. Baseline lookup
    const baseline = BUS_GROUNDING_DB[code];

    // 3. Live search via Serper
    const searchQuery = `${airportName} ${code} ${city} official airport bus service operator route fare timing Play Store app`;
    const searchSnippets = await fetchSerperBusResults(searchQuery);

    // 4. LLM Extraction
    let llmResult: GroundedBusData | null = null;
    if (searchSnippets && searchSnippets.length > 50) {
      llmResult = await verifyBusServiceWithLLM(airportName, code, city, country || 'India', searchSnippets);
    }

    // 5. Merge results
    let finalResult: GroundedBusData;

    if (llmResult) {
      finalResult = { ...llmResult };
      if (baseline) {
        if (baseline.hasBusService === finalResult.hasBusService) {
          if (baseline.officialWebsite) finalResult.officialWebsite = baseline.officialWebsite;
          if (baseline.officialApp) finalResult.officialApp = baseline.officialApp;
          if (baseline.serviceName) finalResult.serviceName = baseline.serviceName;
          if (baseline.operator) finalResult.operator = baseline.operator;
        } else {
          finalResult.sourcesConflict = true;
          finalResult.sourcesConflictNote =
            'Different sources report different information; the official transport authority should be treated as the most reliable source.';
        }
      }
    } else if (baseline) {
      finalResult = { ...baseline };
    } else {
      finalResult = {
        hasBusService: false,
        statusMessage: 'No verified public airport bus service could be confirmed for this airport at the moment.',
        noBusDetails: {
          message: 'No verified public airport bus service could be confirmed for this airport at the moment.',
          alternatives: [
            'Metro / Rapid Transit Line',
            'Pre-paid Airport Taxi Desks',
            'App-based Rideshares (Ola, Uber, Rapido)',
            'Intercity Shuttle / Rental Cars',
          ],
        },
      };
    }

    // Ensure prompt string compliance
    if (finalResult.hasBusService) {
      finalResult.statusMessage = 'Airport Bus Service Available';
      if (finalResult.officialApp && !finalResult.officialApp.recommendationPrompt) {
        finalResult.officialApp.recommendationPrompt =
          'For the most reliable bus tracking and service updates, we recommend installing the official app from the Play Store.';
      }
    } else {
      finalResult.statusMessage =
        'No verified public airport bus service could be confirmed for this airport at the moment.';
      if (!finalResult.noBusDetails) {
        finalResult.noBusDetails = {
          message: 'No verified public airport bus service could be confirmed for this airport at the moment.',
          alternatives: ['Pre-paid Taxis', 'Rideshare Apps', 'Local Shuttles'],
        };
      } else {
        finalResult.noBusDetails.message =
          'No verified public airport bus service could be confirmed for this airport at the moment.';
      }
    }

    // Cache the result
    busCache[code] = {
      data: finalResult,
      timestamp: checkedAt,
      expiresAt: now + CACHE_TTL_MS,
    };

    // Return response
    return res.status(200).json({
      success: true,
      timestamp: checkedAt,
      airportName,
      airportCode: code,
      city,
      country: country || 'India',
      ...finalResult,
      // Backward compatibility fields
      recommendedApp: finalResult.officialApp?.name || 'Official Transport App',
      officialWebsite: finalResult.officialWebsite?.url || null,
      officialWebsiteObj: finalResult.officialWebsite,
      officialAppObj: finalResult.officialApp,
      alternatives: finalResult.noBusDetails?.alternatives || [],
      notes: finalResult.officialWebsite?.note || finalResult.notes || null,
      lastUpdated: checkedAt,
      cached: false,
    });
  } catch (err: any) {
    console.error('[AirportBusController] Unexpected error:', err);
    const code = (req.body.airportCode || '').toUpperCase().trim();
    const fallback = BUS_GROUNDING_DB[code];

    return res.status(500).json({
      success: false,
      error: 'Unable to fetch live airport bus information right now.',
      airportName: req.body.airportName || 'Selected Airport',
      airportCode: code,
      recommendedApp: fallback?.officialApp?.name || 'Local Transit App',
      officialWebsite: fallback?.officialWebsite?.url || null,
      lastUpdated: checkedAt,
    });
  }
}
