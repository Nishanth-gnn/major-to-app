import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../../pages/Login'
import Register from '../../pages/Register'
import Dashboard from '../../features/home/pages/HomePage'
import ChatPage from '../../features/ai-assistant/pages/Chat'
import TransitPage from '../../features/transit-planner/pages/Transit'
import LuggagePage from '../../features/checkin-guidance/pages/Luggage'
import NavigatePage from '../../features/navigation/pages/Navigate'
import TranslatePage from '../../features/translation/pages/Translate'
import SafetyPage from '../../features/women-safety/pages/Safety'
import ProfilePage from '../../pages/Profile'
import BoardingPassPage from '../../features/boarding-pass/pages/BoardingPassPage'
import EmergencyContactPage from '../../features/emergency-contact/pages/EmergencyContactPage'

export default function AppRoutes(){
  return (
    <Routes>
      <Route path='/' element={<Dashboard/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/chat' element={<ChatPage/>} />
      <Route path='/transit' element={<TransitPage/>} />
      <Route path='/luggage' element={<LuggagePage/>} />
      <Route path='/navigate' element={<NavigatePage/>} />
      <Route path='/translate' element={<TranslatePage/>} />
      <Route path='/safety' element={<SafetyPage/>} />
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/boarding-pass' element={<BoardingPassPage/>} />
      <Route path='/emergency-contact' element={<EmergencyContactPage/>} />
    </Routes>
  )
}
