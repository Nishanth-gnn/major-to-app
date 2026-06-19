import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function FloatingAssistant(){
  const nav = useNavigate()
  return (
    <button onClick={()=>nav('/chat')} className="fixed right-4 bottom-20 bg-gradient-to-br from-orange-500 to-pink-500 text-white p-4 rounded-full shadow-xl">
      Ask Aura
    </button>
  )
}
