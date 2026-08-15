// ──────────────────────────────────────────────────────────────
// Food Marketplace Data
// ──────────────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tags: string[];
  rating: number;
  deliveryMins: number;
  gate: string;
  distanceMeters: number;
  status: 'OPEN' | 'BUSY' | 'CLOSED';
  healthMatch: number; // 0-100
  priceRange: '₹' | '₹₹' | '₹₹₹';
  imageColor: string; // gradient for card bg
  emoji: string;
  recommended: MenuItem[];
  caution: MenuItem[];
  avoid: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  emoji: string;
  calories?: number;
}

export interface MealRecommendation {
  id: string;
  name: string;
  restaurant: string;
  gate: string;
  price: number;
  tags: string[];
  emoji: string;
  calories: number;
  protein: string;
  fiber: string;
  sugar: string;
  suitability: 'EXCELLENT' | 'GOOD' | 'CAUTION';
  reasons: string[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export const FOOD_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'healthy', label: 'Healthy', emoji: '🥗' },
  { id: 'protein', label: 'High Protein', emoji: '💪' },
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🫛' },
  { id: 'diabetic', label: 'Diabetic Friendly', emoji: '🩺' },
  { id: 'gluten-free', label: 'Gluten Free', emoji: '🌾' },
  { id: 'low-sodium', label: 'Low Sodium', emoji: '🧂' },
  { id: 'cafes', label: 'Airport Cafes', emoji: '☕' },
  { id: 'fast-food', label: 'Fast Food', emoji: '🍔' },
  { id: 'beverages', label: 'Beverages', emoji: '🥤' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Fresh Greens',
    cuisine: 'Healthy · Salads · Bowls',
    tags: ['healthy', 'vegan', 'vegetarian', 'diabetic', 'gluten-free'],
    rating: 4.8,
    deliveryMins: 12,
    gate: 'Gate 18',
    distanceMeters: 120,
    status: 'OPEN',
    healthMatch: 98,
    priceRange: '₹₹',
    imageColor: 'from-emerald-600 to-teal-700',
    emoji: '🥗',
    recommended: [
      { id: 'fg1', name: 'Grilled Vegetable Bowl', description: 'Seasonal veggies, quinoa, lemon tahini dressing', price: 240, tags: ['High Fiber', 'Low Sugar', 'Vegan'], emoji: '🥣', calories: 320 },
      { id: 'fg2', name: 'Millet Khichdi', description: 'Pearl millet, moong dal, ghee-free, spiced lightly', price: 180, tags: ['Diabetic Friendly', 'Low GI'], emoji: '🍲', calories: 280 },
      { id: 'fg3', name: 'Watermelon Lime Cooler', description: 'Fresh watermelon, lime, no added sugar', price: 90, tags: ['Hydrating', 'Sugar Free'], emoji: '🍉', calories: 60 },
      { id: 'fg4', name: 'Avocado Green Bowl', description: 'Avocado, cucumber, micro greens, flax seeds', price: 290, tags: ['Heart Healthy', 'High Protein'], emoji: '🥑', calories: 380 },
    ],
    caution: [
      { id: 'fg5', name: 'Fruit Yogurt Parfait', description: 'Contains dairy – lactose intolerance caution', price: 140, tags: ['Contains Dairy'], emoji: '🍦', calories: 210 },
    ],
    avoid: [
      { id: 'fg6', name: 'Honey Granola Bar', description: 'High sugar index – avoid for diabetes', price: 80, tags: ['High Sugar'], emoji: '🍯', calories: 290 },
    ],
  },
  {
    id: 'r2',
    name: 'Pure Sattvik Kitchen',
    cuisine: 'Indian · Jain · Diabetic Friendly',
    tags: ['vegetarian', 'diabetic', 'low-sodium', 'healthy'],
    rating: 4.6,
    deliveryMins: 15,
    gate: 'Gate 14',
    distanceMeters: 200,
    status: 'OPEN',
    healthMatch: 94,
    priceRange: '₹',
    imageColor: 'from-orange-600 to-amber-700',
    emoji: '🍛',
    recommended: [
      { id: 'sk1', name: 'Multigrain Khichdi', description: 'Brown rice, moong, turmeric, no salt', price: 160, tags: ['Low GI', 'Diabetic Safe'], emoji: '🍚', calories: 310 },
      { id: 'sk2', name: 'Sattvik Steamed Platter', description: 'Steamed veggies with coconut chutney', price: 190, tags: ['Low Calorie', 'Vegan'], emoji: '🥦', calories: 220 },
      { id: 'sk3', name: 'Coconut Water', description: 'Fresh tender coconut, electrolyte-rich', price: 60, tags: ['Hydrating', 'Natural'], emoji: '🥥', calories: 45 },
    ],
    caution: [
      { id: 'sk4', name: 'Jowar Roti with Ghee', description: 'Moderate fat – consume in limited quantity', price: 120, tags: ['Moderate Fat'], emoji: '🫓', calories: 240 },
    ],
    avoid: [
      { id: 'sk5', name: 'Deep Fried Samosa', description: 'High fat, high glycemic – skip for diabetes', price: 80, tags: ['High GI', 'Deep Fried'], emoji: '🥟', calories: 280 },
      { id: 'sk6', name: 'Gulab Jamun', description: 'Extremely high sugar content', price: 70, tags: ['High Sugar'], emoji: '🍮', calories: 340 },
    ],
  },
  {
    id: 'r3',
    name: 'Starbucks',
    cuisine: 'Coffee · Beverages · Snacks',
    tags: ['cafes', 'beverages'],
    rating: 4.3,
    deliveryMins: 8,
    gate: 'Gate 5',
    distanceMeters: 80,
    status: 'OPEN',
    healthMatch: 42,
    priceRange: '₹₹₹',
    imageColor: 'from-green-700 to-emerald-800',
    emoji: '☕',
    recommended: [
      { id: 'sb1', name: 'Black Coffee (No Sugar)', description: 'Americano, no milk, no sugar', price: 180, tags: ['Sugar Free', 'Dairy Free'], emoji: '☕', calories: 5 },
      { id: 'sb2', name: 'Sparkling Water', description: 'Plain carbonated water, no additives', price: 120, tags: ['Hydrating', 'Zero Calorie'], emoji: '💧', calories: 0 },
    ],
    caution: [
      { id: 'sb3', name: 'Oat Milk Latte', description: 'Low dairy but moderate sugar', price: 280, tags: ['Moderate Sugar'], emoji: '🥛', calories: 160 },
    ],
    avoid: [
      { id: 'sb4', name: 'Caramel Frappuccino', description: 'Very high sugar – dangerous for diabetics', price: 350, tags: ['Very High Sugar', 'Dairy'], emoji: '🧋', calories: 420 },
      { id: 'sb5', name: 'Cheese Croissant', description: 'High fat, dairy, refined flour', price: 220, tags: ['Dairy', 'Refined Flour'], emoji: '🥐', calories: 380 },
    ],
  },
  {
    id: 'r4',
    name: 'Subway',
    cuisine: 'Subs · Wraps · Fresh',
    tags: ['fast-food', 'healthy', 'protein'],
    rating: 4.1,
    deliveryMins: 10,
    gate: 'Gate 12',
    distanceMeters: 150,
    status: 'OPEN',
    healthMatch: 75,
    priceRange: '₹₹',
    imageColor: 'from-yellow-600 to-green-700',
    emoji: '🥖',
    recommended: [
      { id: 'sw1', name: 'Veggie Delight Sub (No Sauce)', description: 'Wheat bread, fresh veggies, no cheese', price: 220, tags: ['Vegetarian', 'Low Calorie'], emoji: '🥖', calories: 290 },
      { id: 'sw2', name: 'Garden Fresh Salad Bowl', description: 'Mixed greens, cucumber, peppers, vinaigrette', price: 180, tags: ['Low Carb', 'Diabetic Friendly'], emoji: '🥗', calories: 180 },
    ],
    caution: [
      { id: 'sw3', name: 'Paneer Tikka Sub', description: 'Contains dairy – lactose intolerance caution', price: 260, tags: ['Contains Dairy'], emoji: '🧀', calories: 380 },
    ],
    avoid: [
      { id: 'sw4', name: 'Cookies & Cream Cookie', description: 'High sugar, refined flour', price: 80, tags: ['High Sugar'], emoji: '🍪', calories: 220 },
    ],
  },
  {
    id: 'r5',
    name: 'Wok Express',
    cuisine: 'Asian · Steamed · Noodles',
    tags: ['vegetarian', 'fast-food'],
    rating: 4.0,
    deliveryMins: 18,
    gate: 'Gate 22',
    distanceMeters: 310,
    status: 'BUSY',
    healthMatch: 68,
    priceRange: '₹₹',
    imageColor: 'from-red-600 to-rose-700',
    emoji: '🍜',
    recommended: [
      { id: 'wk1', name: 'Steamed Veg Dumplings', description: 'Steamed, not fried, low sodium soy dip', price: 160, tags: ['Low Fat', 'Vegetarian'], emoji: '🥟', calories: 200 },
      { id: 'wk2', name: 'Clear Vegetable Broth', description: 'Light broth with bok choy, mushroom', price: 100, tags: ['Low Calorie', 'Hydrating'], emoji: '🍵', calories: 80 },
    ],
    caution: [
      { id: 'wk3', name: 'Schezwan Fried Rice', description: 'High sodium, moderate sugar', price: 200, tags: ['High Sodium'], emoji: '🍚', calories: 440 },
    ],
    avoid: [
      { id: 'wk4', name: 'Sweet & Sour Noodles', description: 'Very high glycemic, processed sauce', price: 220, tags: ['High GI', 'High Sugar'], emoji: '🍝', calories: 520 },
    ],
  },
  {
    id: 'r6',
    name: 'Burger Hub',
    cuisine: 'Burgers · Fries · Shakes',
    tags: ['fast-food'],
    rating: 3.8,
    deliveryMins: 14,
    gate: 'Gate 22',
    distanceMeters: 320,
    status: 'BUSY',
    healthMatch: 18,
    priceRange: '₹₹',
    imageColor: 'from-amber-600 to-red-700',
    emoji: '🍔',
    recommended: [],
    caution: [
      { id: 'bh1', name: 'Veg Burger (No Mayo)', description: 'Skip mayo and cheese for lower fat', price: 180, tags: ['High Carb'], emoji: '🍔', calories: 380 },
    ],
    avoid: [
      { id: 'bh2', name: 'Loaded Cheese Fries', description: 'Very high fat, dairy, sodium', price: 160, tags: ['High Fat', 'Dairy', 'High Sodium'], emoji: '🍟', calories: 580 },
      { id: 'bh3', name: 'Chocolate Milkshake', description: 'Extremely high sugar, dairy – avoid', price: 200, tags: ['Very High Sugar', 'Dairy'], emoji: '🥤', calories: 620 },
    ],
  },
];

export const MEAL_RECOMMENDATIONS: MealRecommendation[] = [
  {
    id: 'mr1',
    name: 'Grilled Vegetable Bowl',
    restaurant: 'Fresh Greens',
    gate: 'Gate 18',
    price: 240,
    tags: ['High Fiber', 'Low Sugar', 'Diabetic Safe'],
    emoji: '🥣',
    calories: 320,
    protein: '12g',
    fiber: '8g',
    sugar: '4g',
    suitability: 'EXCELLENT',
    reasons: ['Low glycemic index', 'No dairy', 'High fiber slows glucose absorption', 'No nuts or allergens'],
  },
  {
    id: 'mr2',
    name: 'Millet Khichdi',
    restaurant: 'Fresh Greens',
    gate: 'Gate 18',
    price: 180,
    tags: ['Diabetic Friendly', 'Low GI', 'Vegetarian'],
    emoji: '🍲',
    calories: 280,
    protein: '9g',
    fiber: '6g',
    sugar: '2g',
    suitability: 'EXCELLENT',
    reasons: ['Pearl millet is slow-digesting', 'Zero dairy ingredients', 'Natural blood sugar regulation', 'Rich in magnesium'],
  },
  {
    id: 'mr3',
    name: 'Multigrain Khichdi',
    restaurant: 'Pure Sattvik Kitchen',
    gate: 'Gate 14',
    price: 160,
    tags: ['Low GI', 'Vegetarian', 'No Salt Added'],
    emoji: '🍚',
    calories: 310,
    protein: '11g',
    fiber: '7g',
    sugar: '3g',
    suitability: 'EXCELLENT',
    reasons: ['Brown rice lowers glycemic response', 'No refined carbs', 'High in dietary fiber', 'Suitable for high blood pressure'],
  },
  {
    id: 'mr4',
    name: 'Veggie Delight Sub (No Sauce)',
    restaurant: 'Subway',
    gate: 'Gate 12',
    price: 220,
    tags: ['Vegetarian', 'Low Calorie'],
    emoji: '🥖',
    calories: 290,
    protein: '10g',
    fiber: '4g',
    sugar: '5g',
    suitability: 'GOOD',
    reasons: ['Fresh vegetables provide vitamins', 'Wheat bread has moderate GI', 'No dairy in plain version', 'Good pre-flight energy'],
  },
  {
    id: 'mr5',
    name: 'Clear Vegetable Broth',
    restaurant: 'Wok Express',
    gate: 'Gate 22',
    price: 100,
    tags: ['Low Calorie', 'Hydrating', 'Low Fat'],
    emoji: '🍵',
    calories: 80,
    protein: '3g',
    fiber: '2g',
    sugar: '1g',
    suitability: 'GOOD',
    reasons: ['Excellent pre-flight hydration', 'Very low calorie', 'Mild on digestion', 'No dairy or nuts'],
  },
];

export const INITIAL_AI_MESSAGES: AIChatMessage[] = [
  {
    id: 'ai1',
    sender: 'assistant',
    text: "Hi there! 👋 I'm your AI Food Assistant. I've analysed your health profile (Diabetes, Lactose Intolerance, Nut Allergy) and your flight AI 542 boarding at 3:20 PM. How can I help you find the perfect meal today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: [
      'What should I eat before a 4-hour flight?',
      'Show high-protein vegetarian meals',
      'Find gluten-free options near Gate 12',
      'Suggest food that won\'t cause acidity',
    ],
  },
];

export const FLIGHT_INFO = {
  flightNumber: 'AI 542',
  airline: 'Air India',
  boardingTime: '3:20 PM',
  recommendedOrderTime: '2:45 PM',
  safePickupBy: '3:05 PM',
  gate: 'A12',
  destination: 'Delhi (DEL)',
};

export const MEDICATION_REMINDERS = [
  { id: 'm1', name: 'Metformin 500mg', time: '6:30 PM', instruction: 'Take with food' },
  { id: 'm2', name: 'Insulin Glargine', time: '7:45 PM', instruction: 'Take with dinner' },
];
