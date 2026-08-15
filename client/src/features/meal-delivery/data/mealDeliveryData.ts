// ─────────────────────────────────────────────────────────────────────────────
// Airport-to-Aircraft Meal Delivery — Data Layer
// ─────────────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  tags: string[];
  calories: number;
  prepMins: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  prepMins: number;
  gate: string;
  distanceMeters: number;
  status: 'OPEN' | 'BUSY' | 'CLOSED';
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  menu: MenuItem[];
}

export interface CartItem {
  item: MenuItem;
  qty: number;
}

export interface PlacedOrder {
  orderId: string;
  restaurantName: string;
  restaurantEmoji: string;
  items: CartItem[];
  total: number;
  flightNumber: string;
  airline: string;
  passengerName: string;
  seat: string;
  gate: string;
  boardingTime: string;
  placedAt: string;
}

export interface TrackingStep {
  id: string;
  label: string;
  detail: string;
  icon: string;
  doneIn: number; // seconds for demo auto-advance
}

// ─────────────────────────────────────────────────────────────────────────────
// Restaurants
// ─────────────────────────────────────────────────────────────────────────────
export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Fresh Greens',
    cuisine: 'Healthy · Salads · Bowls',
    rating: 4.8,
    prepMins: 15,
    gate: 'Gate 18',
    distanceMeters: 120,
    status: 'OPEN',
    emoji: '🥗',
    gradientFrom: '#064e3b',
    gradientTo: '#065f46',
    menu: [
      { id: 'fg1', name: 'Grilled Vegetable Bowl', description: 'Seasonal grilled veggies, quinoa, lemon tahini dressing', price: 240, emoji: '🥣', tags: ['Vegan', 'Gluten Free', 'Low Cal'], calories: 320, prepMins: 12 },
      { id: 'fg2', name: 'Millet Khichdi', description: 'Pearl millet, moong dal, light spices – diabetic friendly', price: 180, emoji: '🍲', tags: ['Diabetic Safe', 'Low GI'], calories: 280, prepMins: 10 },
      { id: 'fg3', name: 'Avocado Green Bowl', description: 'Avocado, micro greens, cucumber, flax seeds, vinaigrette', price: 290, emoji: '🥑', tags: ['High Protein', 'Heart Healthy'], calories: 380, prepMins: 8 },
      { id: 'fg4', name: 'Watermelon Cooler', description: 'Fresh watermelon, lime, mint, no added sugar', price: 90, emoji: '🍉', tags: ['Hydrating', 'Sugar Free'], calories: 60, prepMins: 3 },
      { id: 'fg5', name: 'Fresh Fruit Bowl', description: 'Seasonal mixed fruits, honey drizzle', price: 120, emoji: '🍓', tags: ['Light', 'Vitamins'], calories: 130, prepMins: 5 },
    ],
  },
  {
    id: 'r2',
    name: 'Biryani Hub',
    cuisine: 'Indian · Biryani · Curries',
    rating: 4.6,
    prepMins: 20,
    gate: 'Gate 10',
    distanceMeters: 250,
    status: 'OPEN',
    emoji: '🍛',
    gradientFrom: '#78350f',
    gradientTo: '#92400e',
    menu: [
      { id: 'bh1', name: 'Chicken Biryani', description: 'Basmati rice, slow-cooked chicken, aromatic spices, raita', price: 320, emoji: '🍗', tags: ['High Protein', 'Non-Veg'], calories: 580, prepMins: 18 },
      { id: 'bh2', name: 'Veg Biryani', description: 'Fragrant basmati, mixed vegetables, saffron, cashews', price: 260, emoji: '🍚', tags: ['Vegetarian'], calories: 480, prepMins: 15 },
      { id: 'bh3', name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in spiced tomato gravy', price: 280, emoji: '🧀', tags: ['Vegetarian', 'High Protein'], calories: 520, prepMins: 12 },
      { id: 'bh4', name: 'Dal Makhani', description: 'Slow-cooked black lentils, cream, butter, spices', price: 200, emoji: '🫕', tags: ['Vegetarian', 'Protein Rich'], calories: 380, prepMins: 8 },
      { id: 'bh5', name: 'Gulab Jamun (2 pcs)', description: 'Soft milk-solid dessert in rose sugar syrup', price: 100, emoji: '🍮', tags: ['Dessert', 'Sweet'], calories: 280, prepMins: 3 },
    ],
  },
  {
    id: 'r3',
    name: 'Subway',
    cuisine: 'Subs · Wraps · Fresh',
    rating: 4.1,
    prepMins: 10,
    gate: 'Gate 12',
    distanceMeters: 150,
    status: 'OPEN',
    emoji: '🥖',
    gradientFrom: '#166534',
    gradientTo: '#14532d',
    menu: [
      { id: 'sw1', name: 'Veggie Delight Sub', description: 'Whole wheat, fresh vegetables, chipotle sauce', price: 220, emoji: '🥖', tags: ['Vegetarian', 'Low Cal'], calories: 290, prepMins: 5 },
      { id: 'sw2', name: 'Chicken Tikka Sub', description: 'Marinated chicken, sriracha, crisp lettuce, tomatoes', price: 280, emoji: '🌯', tags: ['High Protein', 'Non-Veg'], calories: 420, prepMins: 7 },
      { id: 'sw3', name: 'Garden Fresh Salad', description: 'Mixed greens, bell peppers, cucumbers, vinaigrette', price: 180, emoji: '🥗', tags: ['Low Carb', 'Light'], calories: 160, prepMins: 4 },
      { id: 'sw4', name: 'Cookies (2 pcs)', description: 'Choco-chip freshly baked cookies', price: 80, emoji: '🍪', tags: ['Dessert'], calories: 220, prepMins: 1 },
    ],
  },
  {
    id: 'r4',
    name: 'Starbucks',
    cuisine: 'Coffee · Beverages · Snacks',
    rating: 4.3,
    prepMins: 8,
    gate: 'Gate 5',
    distanceMeters: 80,
    status: 'OPEN',
    emoji: '☕',
    gradientFrom: '#064e3b',
    gradientTo: '#134e4a',
    menu: [
      { id: 'sb1', name: 'Americano (Hot)', description: 'Double espresso, hot water, served in a travel cup', price: 180, emoji: '☕', tags: ['Caffeine', 'Sugar Free option'], calories: 10, prepMins: 3 },
      { id: 'sb2', name: 'Oat Milk Latte', description: 'Espresso with creamy oat milk, no dairy', price: 280, emoji: '🥛', tags: ['Dairy Free', 'Smooth'], calories: 160, prepMins: 4 },
      { id: 'sb3', name: 'Blueberry Muffin', description: 'Freshly baked muffin with juicy blueberries', price: 160, emoji: '🫐', tags: ['Bakery'], calories: 380, prepMins: 2 },
      { id: 'sb4', name: 'Sparkling Water', description: 'Chilled carbonated water, no additives', price: 100, emoji: '💧', tags: ['Zero Cal', 'Hydrating'], calories: 0, prepMins: 1 },
    ],
  },
  {
    id: 'r5',
    name: 'Healthy Kitchen',
    cuisine: 'Superfood · Protein · Wellness',
    rating: 4.5,
    prepMins: 12,
    gate: 'Gate 20',
    distanceMeters: 200,
    status: 'OPEN',
    emoji: '🌿',
    gradientFrom: '#1e3a5f',
    gradientTo: '#1e40af',
    menu: [
      { id: 'hk1', name: 'Quinoa Power Bowl', description: 'Quinoa, chickpeas, roasted sweet potato, tahini', price: 310, emoji: '🥙', tags: ['High Protein', 'Vegan', 'Superfood'], calories: 420, prepMins: 12 },
      { id: 'hk2', name: 'Greek Yogurt Parfait', description: 'Low-fat yogurt, granola, mixed berries, honey', price: 200, emoji: '🍓', tags: ['Probiotic', 'Protein'], calories: 280, prepMins: 5 },
      { id: 'hk3', name: 'Protein Smoothie', description: 'Banana, almond milk, whey protein, chia seeds', price: 250, emoji: '🥤', tags: ['High Protein', 'Post-workout'], calories: 340, prepMins: 5 },
      { id: 'hk4', name: 'Chia Seed Pudding', description: 'Chia seeds soaked in coconut milk, mango topping', price: 180, emoji: '🥥', tags: ['Vegan', 'Omega-3'], calories: 260, prepMins: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tracking Steps
// ─────────────────────────────────────────────────────────────────────────────
export const TRACKING_STEPS: TrackingStep[] = [
  { id: 't1', label: 'Order Received', detail: 'Your order has been confirmed and sent to the restaurant', icon: '✓', doneIn: 0 },
  { id: 't2', label: 'Restaurant Preparing', detail: 'The chef is preparing your meal fresh', icon: '👨‍🍳', doneIn: 5 },
  { id: 't3', label: 'Handed to Airport Catering', detail: 'Meal packed and transferred to the airline catering team', icon: '🏭', doneIn: 10 },
  { id: 't4', label: 'Loaded onto Aircraft', detail: 'Your meal is secured in the aircraft galley', icon: '✈️', doneIn: 15 },
  { id: 't5', label: 'Delivered to Your Seat', detail: 'Cabin crew delivered to Seat {seat}', icon: '🪑', doneIn: 20 },
];

// ─────────────────────────────────────────────────────────────────────────────
// AI Recommendations based on flight duration
// ─────────────────────────────────────────────────────────────────────────────
export interface AIRecommendation {
  flightType: string;
  headline: string;
  description: string;
  emoji: string;
  suggestedItems: string[];
}

export const AI_RECOMMENDATIONS: AIRecommendation[] = [
  {
    flightType: 'Short Flight (< 2 hrs)',
    headline: 'Light meal recommended',
    description: 'For short flights, a light meal prevents bloating and keeps you comfortable. Avoid heavy fried food.',
    emoji: '🌤️',
    suggestedItems: ['Fresh Fruit Bowl', 'Veggie Delight Sub', 'Watermelon Cooler', 'Sparkling Water'],
  },
  {
    flightType: 'Medium Flight (2–5 hrs)',
    headline: 'Balanced meal recommended',
    description: 'A balanced meal with protein, fibre and complex carbs keeps you energised for the journey.',
    emoji: '✈️',
    suggestedItems: ['Grilled Vegetable Bowl', 'Chicken Tikka Sub', 'Quinoa Power Bowl', 'Oat Milk Latte'],
  },
  {
    flightType: 'Long Flight (5+ hrs)',
    headline: 'High-protein meal recommended',
    description: 'Long flights require sustained energy. High-protein, low-GI meals prevent mid-flight fatigue.',
    emoji: '🌙',
    suggestedItems: ['Chicken Biryani', 'Quinoa Power Bowl', 'Protein Smoothie', 'Millet Khichdi'],
  },
];
