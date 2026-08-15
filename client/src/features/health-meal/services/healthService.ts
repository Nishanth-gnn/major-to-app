import {
  HealthProfile,
  MedicationItem,
  FlightMealInfo,
  RestaurantOption,
} from '../types';
import {
  DEFAULT_HEALTH_PROFILE,
  INITIAL_MEDICATIONS,
  MOCK_FLIGHT_MEAL,
  NEARBY_RESTAURANTS,
} from '../data/healthMockData';

const HEALTH_PROFILE_STORAGE_KEY = 'smart_airport_health_profile';
const MEDICATIONS_STORAGE_KEY = 'smart_airport_medications';

export const getHealthProfile = (): HealthProfile => {
  try {
    const raw = localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_HEALTH_PROFILE;
  } catch {
    return DEFAULT_HEALTH_PROFILE;
  }
};

export const saveHealthProfile = (profile: HealthProfile): void => {
  try {
    localStorage.setItem(HEALTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save health profile:', e);
  }
};

export const getMedications = (): MedicationItem[] => {
  try {
    const raw = localStorage.getItem(MEDICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MEDICATIONS;
  } catch {
    return INITIAL_MEDICATIONS;
  }
};

export const saveMedications = (meds: MedicationItem[]): void => {
  try {
    localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(meds));
  } catch (e) {
    console.error('Failed to save medications:', e);
  }
};

export const getFlightMealCompatibility = (profile: HealthProfile): FlightMealInfo => {
  const hasDiabetes = profile.medicalConditions.includes('Diabetes');
  const hasLactose = profile.medicalConditions.includes('Lactose Intolerance');
  const hasNut = profile.medicalConditions.includes('Nut Allergy');

  const warnings: string[] = [];
  let status: 'SUITABLE' | 'CAUTION' | 'AVOID' = 'SUITABLE';

  if (hasDiabetes) {
    warnings.push('⚠ Selected meal contains high-carbohydrate refined rice & dessert.');
    status = 'CAUTION';
  }
  if (hasLactose) {
    warnings.push('⚠ Selected meal includes milk curd/dairy dessert.');
    status = 'CAUTION';
  }
  if (hasNut) {
    warnings.push('⚠ Ensure meal is processed in a nut-free facility.');
  }

  let recommended = 'Standard Healthy Meal';
  if (hasDiabetes && hasLactose) {
    recommended = 'Diabetic Lactose-Free Vegetarian Meal (DBML)';
  } else if (hasDiabetes) {
    recommended = 'Diabetic Low-GI Meal (DBML)';
  } else if (hasLactose) {
    recommended = 'Non-Dairy Vegetarian Meal (NLML)';
  }

  return {
    ...MOCK_FLIGHT_MEAL,
    compatibilityStatus: status,
    warnings: warnings.length > 0 ? warnings : ['✓ Meal is compatible with your health profile.'],
    recommendedMeal: recommended,
  };
};

export const exportHealthProfileJSON = (profile: HealthProfile, meds: MedicationItem[]): string => {
  const data = {
    profile,
    medications: meds,
    exportTimestamp: new Date().toISOString(),
    system: 'Smart Airport Health Assistant',
  };
  return JSON.stringify(data, null, 2);
};
