import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/Chat'
import TransitPage from './pages/Transit'
import LuggagePage from './pages/Luggage'
import NavigatePage from './pages/Navigate'
import TranslatePage from './pages/Translate'
import SafetyPage from './pages/Safety'
import ProfilePage from './pages/Profile'

function App(){
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
