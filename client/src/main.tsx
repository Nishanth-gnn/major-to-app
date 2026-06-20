import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app/routes'
import './styles/index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './features/home/pages/HomePage'
import ChatPage from './features/ai-assistant/pages/Chat'
import TransitPage from './features/transit-planner/pages/Transit'
import LuggagePage from './features/checkin-guidance/pages/Luggage'
import NavigatePage from './features/navigation/pages/Navigate'
import TranslatePage from './features/translation/pages/Translate'
import SafetyPage from './features/women-safety/pages/Safety'
import ProfilePage from './pages/Profile'
import Navbar from './shared/components/Navbar'

function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
