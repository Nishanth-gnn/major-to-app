export interface Department {
  id: string;
  name: string;
  officerName: string;
  officerRole: string;
  avatarUrl: string;
  estimatedWaitSeconds: number;
  keywords: string[];
  initialGreeting: string;
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'baggage',
    name: 'Baggage Services',
    officerName: 'Priya Sharma',
    officerRole: 'Luggage Operations Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=60',
    estimatedWaitSeconds: 15,
    keywords: ['bag', 'baggage', 'luggage', 'suitcase', 'lost item', 'carousel', 'lost property'],
    initialGreeting: 'Hello, I am Priya from Baggage Services. I see you are reporting an issue with your luggage. Let me help you trace it. Could you please share your luggage tag number or flight details?'
  },
  {
    id: 'security',
    name: 'Airport Security',
    officerName: 'Officer Vikram Singh',
    officerRole: 'Security Duty Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=60',
    estimatedWaitSeconds: 20,
    keywords: ['passport', 'security', 'immigration', 'lost passport', 'id', 'gate security', 'police', 'customs'],
    initialGreeting: 'This is Officer Vikram. I understand you have a security-related concern or a lost travel document. Please note that for your safety, we handle these matters with high priority. How can I assist you right now?'
  },
  {
    id: 'medical',
    name: 'Medical Assistance',
    officerName: 'Dr. Anita Roy',
    officerRole: 'Emergency Medical Officer',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=60',
    estimatedWaitSeconds: 10,
    keywords: ['medical', 'doctor', 'sick', 'injured', 'pain', 'medicine', 'first aid', 'accident', 'health', 'heart'],
    initialGreeting: 'Hello, this is Dr. Anita from the Airport First Aid Clinic. Please stay calm. Are you or the person requiring help in immediate danger? If you can, please share your current location/nearest gate.'
  },
  {
    id: 'assistance',
    name: 'Passenger Assistance',
    officerName: 'Rohan Mehta',
    officerRole: 'Special Assistance Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=60',
    estimatedWaitSeconds: 25,
    keywords: ['wheelchair', 'old', 'disabled', 'assistance', 'stretcher', 'blind', 'elderly', 'child', 'special need'],
    initialGreeting: 'Hi, I am Rohan. I specialize in helping passenger request wheelchair support, elderly mobility assistance, or stroller support. Where are you currently, and how can we support your transit today?'
  },
  {
    id: 'airline',
    name: 'Airline Help Desk',
    officerName: 'Sarah Jenkins',
    officerRole: 'Airline Relations Supervisor',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=60',
    estimatedWaitSeconds: 30,
    keywords: ['missed', 'connecting', 'flight', 'delay', 'terminal change', 'ticket', 'rebook', 'boarding pass', 'airline'],
    initialGreeting: 'Hello, I am Sarah. I can help you coordinate with your airline for missed connections, flight schedule changes, or rebooking tickets. Please share your ticket booking reference (PNR) or flight number.'
  },
  {
    id: 'information',
    name: 'Information Desk',
    officerName: 'Karan Malhotra',
    officerRole: 'Guest Services Executive',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=60',
    estimatedWaitSeconds: 15,
    keywords: ['navigation', 'gate', 'food', 'toilet', 'restroom', 'lounge', 'where is', 'directions', 'shop', 'duty free'],
    initialGreeting: 'Hello! Welcome to Guest Services. I am Karan. I can help you find gates, lounges, restrooms, dining options, or shops. What are you looking for today?'
  }
];

export const DEFAULT_DEPARTMENT: Department = {
  id: 'general',
  name: 'Information Desk',
  officerName: 'Anjali Sharma',
  officerRole: 'Airport Experience Executive',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60',
  estimatedWaitSeconds: 20,
  keywords: [],
  initialGreeting: 'Hello, I am Anjali. How can I help you find your way or connect you to the right services at the airport today?'
};

export const AI_SOLUTIONS = [
  {
    keywords: ['bag', 'baggage', 'luggage'],
    response: 'To report lost or delayed baggage, proceed to the Baggage Claim area on Level 1. Locate your airline\'s Baggage Service Office (BSO) or use the self-service baggage kiosk. Ensure you have your baggage tags and boarding pass ready to file a Property Irregularity Report (PIR).'
  },
  {
    keywords: ['passport', 'visa', 'id', 'document'],
    response: 'If you have lost your passport inside the terminal, immediately notify the nearest security guard or proceed to the Security Office located near Terminal 1 Main Entrance. Do not cross border immigration control without a valid document.'
  },
  {
    keywords: ['medical', 'doctor', 'clinic', 'first aid', 'sick'],
    response: 'For minor medical issues, there is an Airport Pharmacy & Medical Clinic open 24/7 on Level 2 (near Departure Gate A5). For emergencies, look for the red SOS emergency pillars or dial 112 from any airport public phone.'
  },
  {
    keywords: ['wheelchair', 'assistance', 'elderly', 'special need'],
    response: 'Wheelchair and mobility assistance should ideally be pre-booked with your airline. However, you can request immediate help at any airline check-in counter, or at the Guest Services kiosk near the Departure Hall Entrance.'
  },
  {
    keywords: ['missed', 'delay', 'connecting', 'flight', 'rebook'],
    response: 'If you have missed your connection, visit the nearest Transfer Desk (clearly signed as "Transfer Service") located in the transit hall. The staff there can retrieve your baggage details and rebook you on the next available flight.'
  },
  {
    keywords: ['gate', 'where is', 'b12', 'terminal'],
    response: 'Gate locations are shown on the overhead flight information boards. Gates starting with A and B are on the East Concourse; gates starting with C and D are on the West Concourse. It takes approximately 8-12 minutes to walk from security to most gates.'
  },
  {
    keywords: ['wifi', 'internet'],
    response: 'Free high-speed airport Wi-Fi is available. Select the network named "FREE_AIRPORT_WIFI", open your web browser, agree to the terms, and enter your mobile number or email to connect.'
  }
];

export const STAFF_REPLIES = [
  "I am looking into this right now for you.",
  "Let me check our real-time system database.",
  "Could you please confirm if you have already crossed security control?",
  "I have flagged this with our on-ground team. They will be looking out for you.",
  "Yes, that is correct. I am updating your status in our system."
];

export function routeIssue(description: string): Department {
  const cleanDesc = description.toLowerCase();
  for (const dept of DEPARTMENTS) {
    if (dept.keywords.some(kw => cleanDesc.includes(kw))) {
      return dept;
    }
  }
  return DEFAULT_DEPARTMENT;
}

export function getAIAnswer(description: string): string {
  const cleanDesc = description.toLowerCase();
  for (const sol of AI_SOLUTIONS) {
    if (sol.keywords.some(kw => cleanDesc.includes(kw))) {
      return sol.response;
    }
  }
  return "Based on your query, we recommend checking the main info display or proceeding to speak with our support staff directly, who have real-time access to flight schedules, gate changes, and baggage status.";
}
