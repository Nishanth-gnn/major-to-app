export type AgencyType = 'police' | 'medical' | 'operations' | 'fire';

export interface AgencyInfo {
  id: AgencyType;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}

export const AGENCIES: Record<AgencyType, AgencyInfo> = {
  police: {
    id: 'police',
    name: 'Airport Police & Security',
    shortName: 'Airport Police',
    icon: '🚔',
    color: '#ef4444',
    badgeBg: 'bg-red-500/20',
    badgeBorder: 'border-red-500/40',
    badgeText: 'text-red-300',
    description: 'Immediate law enforcement & threat response team.',
  },
  medical: {
    id: 'medical',
    name: 'Airport Medical & Paramedic Team',
    shortName: 'Airport Medical Team',
    icon: '🚑',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    description: 'Emergency medical services & first response paramedics.',
  },
  operations: {
    id: 'operations',
    name: 'Airport Operations / Customer Support',
    shortName: 'Airport Operations',
    icon: '🏢',
    color: '#f97316',
    badgeBg: 'bg-orange-500/20',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-300',
    description: 'Passenger assistance, passenger dispatch & concourse operations.',
  },
  fire: {
    id: 'fire',
    name: 'Airport Fire & Rescue Squad',
    shortName: 'Fire & Rescue Team',
    icon: '🚒',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    description: 'Hazmat, fire suppression & structural rescue services.',
  },
};

export interface EmergencyReasonItem {
  id: string;
  label: string;
  category: 'Police' | 'Medical' | 'Fire';
  primaryAgency: AgencyType;
  additionalAgencies: AgencyType[];
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const EMERGENCY_CATEGORIES = [
  { id: 'Police', name: 'Police & Security', icon: '🚔', color: 'from-red-600 to-rose-700' },
  { id: 'Medical', name: 'Medical Emergency', icon: '🚑', color: 'from-emerald-600 to-teal-700' },
  { id: 'Fire', name: 'Fire & Rescue', icon: '🚒', color: 'from-amber-600 to-red-700' },
] as const;

export const EMERGENCY_REASONS: EmergencyReasonItem[] = [
  // POLICE EMERGENCIES
  { id: 'pol_1', label: 'Physical assault or harassment', category: 'Police', primaryAgency: 'police', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'pol_2', label: 'Theft / stolen belongings', category: 'Police', primaryAgency: 'police', additionalAgencies: [], priority: 'HIGH' },
  { id: 'pol_3', label: 'Robbery', category: 'Police', primaryAgency: 'police', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'pol_4', label: 'Security threat', category: 'Police', primaryAgency: 'police', additionalAgencies: ['fire'], priority: 'CRITICAL' },
  { id: 'pol_5', label: 'Suspicious or unattended baggage', category: 'Police', primaryAgency: 'police', additionalAgencies: ['fire'], priority: 'CRITICAL' },
  { id: 'pol_6', label: 'Unauthorized person', category: 'Police', primaryAgency: 'police', additionalAgencies: [], priority: 'HIGH' },
  { id: 'pol_7', label: 'Child missing', category: 'Police', primaryAgency: 'police', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'pol_8', label: 'Missing person', category: 'Police', primaryAgency: 'police', additionalAgencies: [], priority: 'HIGH' },

  // MEDICAL EMERGENCIES
  { id: 'med_1', label: 'Chest pain / heart attack', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'med_2', label: 'Unconscious passenger', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'med_3', label: 'Difficulty breathing', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'med_4', label: 'Severe bleeding', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'med_5', label: 'Fracture or injury', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'HIGH' },
  { id: 'med_6', label: 'Allergic reaction', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'HIGH' },
  { id: 'med_7', label: 'Diabetic emergency', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'HIGH' },
  { id: 'med_8', label: 'Stroke symptoms', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'med_9', label: 'Seizure', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'CRITICAL' },
  { id: 'med_10', label: 'Pregnant passenger requiring assistance', category: 'Medical', primaryAgency: 'medical', additionalAgencies: [], priority: 'HIGH' },

  // FIRE & RESCUE
  { id: 'fire_1', label: 'Fire or smoke', category: 'Fire', primaryAgency: 'fire', additionalAgencies: ['police'], priority: 'CRITICAL' },
  { id: 'fire_2', label: 'Gas leak', category: 'Fire', primaryAgency: 'fire', additionalAgencies: ['police'], priority: 'CRITICAL' },
  { id: 'fire_3', label: 'Hazardous chemical spill', category: 'Fire', primaryAgency: 'fire', additionalAgencies: ['police'], priority: 'CRITICAL' },
  { id: 'fire_4', label: 'Electrical hazard', category: 'Fire', primaryAgency: 'fire', additionalAgencies: ['police'], priority: 'HIGH' },
  { id: 'fire_5', label: 'Explosion or blast', category: 'Fire', primaryAgency: 'fire', additionalAgencies: ['police'], priority: 'CRITICAL' },
];

export interface NearestFacility {
  name: string;
  type: string;
  distance: string;
  etaMinutes: string;
  locationDetails: string;
  icon: string;
}

export const getNearestFacility = (category: string): NearestFacility => {
  switch (category) {
    case 'Medical':
      return {
        name: 'Medical Room A (First Aid Clinic)',
        type: 'Emergency Medical Station & AED',
        distance: '180 meters',
        etaMinutes: '2 minutes walk',
        locationDetails: 'Terminal 3 Arrivals, Concourse Level B (Near Gate A12)',
        icon: '🏥',
      };
    case 'Police':
      return {
        name: 'Airport Security Control & Police Desk T3',
        type: 'Police Response Post',
        distance: '120 meters',
        etaMinutes: '1.5 minutes walk',
        locationDetails: 'Terminal 3 Concourse Ground Level (Near Central Hub)',
        icon: '🚔',
      };
    case 'Fire':
      return {
        name: 'Fire Response Station #2 & Emergency Exit',
        type: 'Hazmat & Suppression Station',
        distance: '250 meters',
        etaMinutes: '3 minutes walk',
        locationDetails: 'Terminal 3 Outer Apron Way, Emergency Gate R-12',
        icon: '🚒',
      };
    default:
      return {
        name: 'Customer Service & Assistance Desk B',
        type: 'Operations Information Counter',
        distance: '90 meters',
        etaMinutes: '1 minute walk',
        locationDetails: 'Terminal 3 Main Atrium (Near Baggage Belt 4)',
        icon: '🏢',
      };
  }
};
