import React from 'react'

export default function EmergencyHelp(){
  return (
    <div className="bg-white p-3 rounded-lg shadow flex gap-2">
      <button className="flex-1 py-2 bg-red-600 text-white rounded">SOS</button>
      <button className="flex-1 py-2 bg-orange-500 text-white rounded">Medical Help</button>
      <button className="flex-1 py-2 bg-blue-600 text-white rounded">Airport Security</button>
    </div>
  )
}
