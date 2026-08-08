import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app/routes'
import './styles/index.css'
import 'leaflet/dist/leaflet.css'
import Navbar from './shared/components/Navbar'
import { useDarkMode } from './shared/hooks/useDarkMode'
import AuraModal from './features/ai-assistant/components/AuraModal'

function App(){
  // Calling useDarkMode here ensures the `dark` class is
  // applied to <html> on every page across the entire app.
  useDarkMode();

  const [auraOpen, setAuraOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setAuraOpen(true);
    const handleClose = () => setAuraOpen(false);

    window.addEventListener('aura-open-event', handleOpen);
    window.addEventListener('aura-close-event', handleClose);

    return () => {
      window.removeEventListener('aura-open-event', handleOpen);
      window.removeEventListener('aura-close-event', handleClose);
    };
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <AppRoutes />
      </div>
      <AuraModal open={auraOpen} onClose={() => {
        setAuraOpen(false);
        window.dispatchEvent(new Event('aura-close-event'));
      }} />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
