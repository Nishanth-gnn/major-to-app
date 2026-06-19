import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import FlightCard from '../components/FlightCard'
import HeroAction from '../components/HeroAction'
import QuickActions from '../components/QuickActions'
import Alerts from '../components/Alerts'
import EmergencyHelp from '../components/EmergencyHelp'
import FloatingAssistant from '../components/FloatingAssistant'
import BottomNav from '../components/BottomNav'

export default function Dashboard(){
  const [transit, setTransit] = useState<any|null>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [initialized, setInitialized] = useState<boolean>(() => !!localStorage.getItem('boardingPassId'))
  const [boardingPassId, setBoardingPassId] = useState<string>(localStorage.getItem('boardingPassId') || '')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(()=>{
    if (initialized) fetchTransit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[initialized])

  function getDummyData(id: string) {
    // Simple deterministic dummy mapping based on boarding pass id
    const seed = id.split('').reduce((s,c)=>s + c.charCodeAt(0), 0)
    const gates = ['A12','B5','C3','B12','D4']
    const from = ['HYD','BOM','BLR','DEL','MAA'][seed % 5]
    const to = ['DEL','HYD','MUM','BLR','MAA'][(seed+1) % 5]
    const gate = gates[seed % gates.length]
    const remainingMinutes = 30 + (seed % 90)
    const stressLevel = remainingMinutes > 90 ? 'green' : remainingMinutes >= 45 ? 'yellow' : 'red'
    const recommendation = stressLevel === 'green' ? 'Relax — you have time' : stressLevel === 'yellow' ? 'Head towards security soon' : 'Proceed immediately to gate'
    return {
      flightNumber: `AI${(seed%900)+100}`,
      gate,
      from,
      to,
      status: ['ON TIME','DELAYED','BOARDING'][seed % 3],
      remainingMinutes,
      stressLevel,
      recommendation,
      message: `${recommendation}. Boarding in ${remainingMinutes} minutes.`
    }
  }

  async function fetchTransit(){
    try{
      setLoading(true)
      if (boardingPassId) {
        // use dummy data for now
        const data = getDummyData(boardingPassId)
        setTransit(data)
      } else {
        // nothing to fetch without boarding pass id
        setTransit(null)
      }
    }catch(err){
      console.warn('transit fetch AxiosError', err)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="p-4 pb-28 max-w-3xl mx-auto">
      <Header />

      {!initialized ? (
        <div className="mt-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Enter Boarding Pass</h2>
            <p className="text-sm text-slate-500 mb-4">Please enter your boarding pass ID to view your personalized guidance.</p>
            <div className="grid grid-cols-1 gap-3">
              <input value={boardingPassId} onChange={e=>setBoardingPassId(e.target.value)} placeholder="Boarding pass ID" className="input" />
              <div className="flex gap-2">
                <button onClick={()=>{
                  if (!boardingPassId) return
                  localStorage.setItem('boardingPassId', boardingPassId)
                  setInitialized(true)
                  fetchTransit()
                }} className="btn btn-primary">Show My Plan</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FlightCard flight={transit} />
              <div className="mt-4">
                <HeroAction title={transit?.recommendation || 'Proceed to Security Check'} subtitle={transit?.message || ''} eta={transit?.remainingMinutes ? `${transit.remainingMinutes}m` : undefined} />
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-500 mb-2">Quick Actions</div>
              <QuickActions />
              <div className="mt-6">
                <div className="text-sm text-slate-500 mb-2">Smart Alerts</div>
                <Alerts alerts={alerts} />
                <div className="mt-4">
                  <div className="text-sm text-slate-500 mb-2">Emergency & Help</div>
                  <EmergencyHelp />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <FloatingAssistant />
      <BottomNav />
    </div>
  )
}
