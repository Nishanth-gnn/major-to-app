export type MedicalCondition =
  | 'Diabetes'
  | 'Hypertension'
  | 'Heart Disease'
  | 'Kidney Disease'
  | 'Pregnancy'
  | 'Thyroid Disorder'
  | 'Lactose Intolerance'
  | 'Gluten Intolerance'
  | 'Nut Allergy'
  | 'Shellfish Allergy'
  | 'Egg Allergy'
  | 'Other';

export type DietaryPreference =
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Vegan'
  | 'Jain'
  | 'Halal'
  | 'Kosher'
  | 'Low Sodium'
  | 'Diabetic Meal'
  | 'Gluten Free'
  | 'Lactose Free';

export interface HealthProfile {
  passengerName: string;
  medicalConditions: MedicalCondition[];
  dietaryPreferences: DietaryPreference[];
  allergies: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
  updatedAt: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  instruction: 'With Food' | 'Empty Stomach' | 'Before Bed' | 'After Meal';
  reminderEnabled: boolean;
}

export interface FlightMealInfo {
  flightNumber: string;
  airline: string;
  departureTime: string;
  duration: string;
  mealAvailable: boolean;
  selectedMeal: string;
  compatibilityStatus: 'SUITABLE' | 'CAUTION' | 'AVOID';
  warnings: string[];
  recommendedMeal: string;
  suggestedAction: string;
}

export interface RestaurantOption {
  id: string;
  name: string;
  gateNumber: string;
  distance: string;
  cuisine: string;
  suitability: 'RECOMMENDED' | 'SUITABLE' | 'AVOID';
  recommendedItems: string[];
  avoidItems: string[];
  image?: string;
  walkingTimeMins: number;
}

export interface NutritionTimelineStep {
  id: string;
  time: string;
  title: string;
  category: 'MEAL' | 'MEDICATION' | 'HYDRATION' | 'BOARDING' | 'SNACK';
  description: string;
  icon: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
}

export interface AIMealChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedItems?: string[];
  badge?: 'RECOMMENDED' | 'CAUTION' | 'SAFE';
}
