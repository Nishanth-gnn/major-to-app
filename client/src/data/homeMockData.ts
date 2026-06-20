const user = {
  name: 'Saivenkat',
  avatar: '/avatar-placeholder.png',
  airport: 'Hyderabad Airport',
  terminal: '1'
}

const flight = {
  airline: 'AIR INDIA',
  flightNumber: 'AI217',
  from: 'HYD',
  to: 'DEL',
  fromCity: 'Hyderabad',
  toCity: 'Delhi',
  gate: 'B12',
  boardingIn: '1h 25m',
  status: 'ON TIME',
  aircraftImage: '/aircraft.png'
}

const quickActions = [
  { id: 'navigate', title: 'Navigate', to: '/navigate' },
  { id: 'staff', title: 'Talk to Staff', to: '/chat', badge: 'NEW' },
  { id: 'translate', title: 'Translate', to: '/translate' },
  { id: 'checkin', title: 'Check-in Guide', to: '/luggage' },
  { id: 'transit', title: 'Transit Planner', to: '/transit' },
  { id: 'safety', title: 'Women Safety', to: '/safety' }
]

const emergencyActions = [
  { id: 'sos', title: 'SOS Emergency', variant: 'danger' },
  { id: 'medical', title: 'Medical Help', variant: 'default' },
  { id: 'security', title: 'Airport Security', variant: 'default' }
]

export { user, flight, quickActions, emergencyActions }
