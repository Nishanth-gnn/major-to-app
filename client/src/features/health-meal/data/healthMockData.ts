import {
  HealthProfile,
  MedicationItem,
  FlightMealInfo,
  RestaurantOption,
  NutritionTimelineStep,
  AIMealChatMessage,
} from '../types';

export const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  passengerName: 'Sai Venkat',
  medicalConditions: ['Diabetes', 'Lactose Intolerance', 'Nut Allergy'],
  dietaryPreferences: ['Vegetarian', 'Diabetic Meal', 'Lactose Free', 'Low Sodium'],
  allergies: ['Peanuts', 'Dairy Milk', 'Cashews'],
  emergencyContactName: 'Dr. Ramesh Kumar (Family Physician)',
  emergencyContactPhone: '+91 98490 12345',
  notes: 'Requires low-glycemic vegetarian meals and non-dairy beverages during flight.',
  updatedAt: new Date().toLocaleDateString(),
};

export const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    dosage: '500 mg',
    frequency: 'Twice Daily',
    time: '06:30 PM',
    instruction: 'With Food',
    reminderEnabled: true,
  },
  {
    id: 'med-2',
    name: 'Blood Pressure Medication (Telmisartan)',
    dosage: '40 mg',
    frequency: 'Once Daily',
    time: '08:00 AM',
    instruction: 'Empty Stomach',
    reminderEnabled: true,
  },
  {
    id: 'med-3',
    name: 'Insulin Glargine',
    dosage: '10 Units',
    frequency: 'Before Dinner',
    time: '07:45 PM',
    instruction: 'With Food',
    reminderEnabled: true,
  },
];

export const MOCK_FLIGHT_MEAL: FlightMealInfo = {
  flightNumber: 'AI 542',
  airline: 'Air India',
  departureTime: '03:20 PM',
  duration: '2h 15m',
  mealAvailable: true,
  selectedMeal: 'Standard Vegetarian (AVML)',
  compatibilityStatus: 'CAUTION',
  warnings: [
    '⚠ Selected meal contains high-glycemic refined rice and dairy yogurt.',
    '⚠ Potential allergen conflict with lactose intolerance profile.',
  ],
  recommendedMeal: 'Diabetic Vegetarian Meal (DBML / Lactose-Free)',
  suggestedAction: 'Request meal modification at Gate A12 desk or via airline app before boarding (20 mins remaining).',
};

export const NEARBY_RESTAURANTS: RestaurantOption[] = [
  {
    id: 'rest-1',
    name: 'Green Bowl Organics & Millet Bar',
    gateNumber: 'Gate 18',
    distance: '120 meters',
    walkingTimeMins: 2,
    cuisine: 'Healthy / Organic / Salads',
    suitability: 'RECOMMENDED',
    recommendedItems: ['Steamed Millet Bowl', 'Grilled Tofu Salad', 'Fresh Watermelon Juice', 'Sugar-Free Almond Yogurt'],
    avoidItems: ['Sugary Smoothies'],
  },
  {
    id: 'rest-2',
    name: 'Pure Veg Sattvik Kitchen',
    gateNumber: 'Gate 14',
    distance: '200 meters',
    walkingTimeMins: 3,
    cuisine: 'Indian / Jain / Diabetic Friendly',
    suitability: 'RECOMMENDED',
    recommendedItems: ['Multigrain Khichdi', 'Sattvik Steamed Vegetables', 'Lactose-Free Coconut Water'],
    avoidItems: ['Deep Fried Samosa', 'Gulab Jamun'],
  },
  {
    id: 'rest-3',
    name: 'Concourse Artisan Bakery & Cafe',
    gateNumber: 'Gate 12',
    distance: '150 meters',
    walkingTimeMins: 2,
    cuisine: 'Bakery / Coffee / Pastries',
    suitability: 'AVOID',
    recommendedItems: ['Black Coffee (No Sugar)'],
    avoidItems: ['Cream Pasta', 'Chocolate Croissant', 'Sugary Iced Latte', 'Cheese Cake'],
  },
  {
    id: 'rest-4',
    name: 'Wok & Noodle Express',
    gateNumber: 'Gate 22',
    distance: '310 meters',
    walkingTimeMins: 4,
    cuisine: 'Asian / Steamed Dim Sums',
    suitability: 'SUITABLE',
    recommendedItems: ['Steamed Veg Dumplings', 'Clear Vegetable Broth'],
    avoidItems: ['Sweet & Sour Crispy Noodles'],
  },
];

export const NUTRITION_TIMELINE: NutritionTimelineStep[] = [
  {
    id: 't-1',
    time: '02:30 PM',
    title: 'Pre-flight Hydration',
    category: 'HYDRATION',
    description: 'Drink 500ml water to offset cabin dry air effects.',
    icon: '💧',
    status: 'COMPLETED',
  },
  {
    id: 't-2',
    time: '03:00 PM',
    title: 'Recommended Healthy Snack',
    category: 'SNACK',
    description: 'Steamed Millet Bowl at Green Bowl Organics (Gate 18).',
    icon: '🥗',
    status: 'ACTIVE',
  },
  {
    id: 't-3',
    time: '03:20 PM',
    title: 'Boarding Flight AI 542',
    category: 'BOARDING',
    description: 'Boarding at Gate A12. Ensure medical pouch is in carry-on.',
    icon: '✈️',
    status: 'UPCOMING',
  },
  {
    id: 't-4',
    time: '04:15 PM',
    title: 'In-flight Diabetic Meal',
    category: 'MEAL',
    description: 'Diabetic Low-GI Meal service served on board.',
    icon: '🍽️',
    status: 'UPCOMING',
  },
  {
    id: 't-5',
    time: '06:30 PM',
    title: 'Evening Medication Dose',
    category: 'MEDICATION',
    description: 'Take Metformin (500mg) with food or post-meal snack.',
    icon: '💊',
    status: 'UPCOMING',
  },
];

export const INITIAL_AI_CHAT_MESSAGES: AIMealChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: 'Hello Sai Venkat! I am your AI Health & Meal Assistant. I have loaded your health profile (Diabetes, Lactose Intolerance, Nut Allergy). How can I help you choose healthy food for your flight today?',
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Is the standard vegetarian meal on Flight AI 542 suitable for my diabetes?',
    timestamp: '10:01 AM',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    text: 'Caution advised. Standard Vegetarian (AVML) often includes white rice and sweet dessert, which can cause rapid blood sugar spikes. I recommend requesting a Diabetic Meal (DBML) at Gate A12 desk or opting for the Steamed Millet Bowl at Green Bowl Organics.',
    timestamp: '10:01 AM',
    badge: 'CAUTION',
    suggestedItems: ['Request DBML Meal at Gate A12', 'Get Steamed Millet Bowl (Gate 18)'],
  },
];
