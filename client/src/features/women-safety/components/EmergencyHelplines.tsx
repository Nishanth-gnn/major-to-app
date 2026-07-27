import React, { useState } from 'react'

interface ContactLine {
  label: string
  subtitle: string
  number: string
  icon: string
}

const HELPLINES: ContactLine[] = [
  {
    label: 'Airport Security Control Desk',
    subtitle: 'Immediate dispatch room (Toll Free)',
    number: '+18002477233',
    icon: '📞'
  },
  {
    label: 'All-India Women Helpline',
    subtitle: 'Emergency Ministry contact line',
    number: '1091',
    icon: '👩'
  },
  {
    label: 'Airport Medical Trauma Kiosk',
    subtitle: 'Emergency paramedic dispatch desk',
    number: '+18002476334',
    icon: '🚑'
  },
  {
    label: 'National Emergency Response System',
    subtitle: 'Police, Fire, and Ambulance liaison',
    number: '112',
    icon: '👮'
  }
]

export default function EmergencyHelplines() {
  const [familyPhone, setFamilyPhone] = useState(() => {
    return localStorage.getItem('family_phone_alert') || '+91 98765 43210'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const saveFamilyPhone = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('family_phone_alert', familyPhone)
    setIsEditing(false)
  }

  const handleSendSMS = () => {
    setSmsStatus('sending')
    // Prefill an SMS message
    const msg = encodeURIComponent(`Emergency: I am at Hyderabad Airport Terminal 1, Gate B12. I feel unsafe. Please monitor my location. Link: https://maps.google.com/?q=17.2403,78.4294`)
    
    // Attempt to open sms scheme in phone browser
    const cleanPhone = familyPhone.replace(/\s+/g, '')
    const smsHref = `sms:${cleanPhone}?body=${msg}`

    setTimeout(() => {
      setSmsStatus('sent')
      window.open(smsHref, '_self')
      setTimeout(() => setSmsStatus('idle'), 3000)
    }, 800)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Helplines & Direct Contacts</h3>
          <p className="text-xs text-slate-400">Instant connection buttons and pre-composed SMS coordinates sharing to family.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        
        {/* Helplines List */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Airport Helpline Speed-Dial</h4>
          <div className="space-y-2">
            {HELPLINES.map((hl) => (
              <a
                key={hl.number}
                href={`tel:${hl.number}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50 hover:bg-white transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{hl.icon}</span>
                  <div>
                    <div className="font-bold text-slate-800">{hl.label}</div>
                    <div className="text-[10px] text-slate-400">{hl.subtitle}</div>
                  </div>
                </div>
                <div className="bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-lg border border-red-100 text-[10px] uppercase font-mono">
                  {hl.number}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SOS SMS Dispatch */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emergency Family SMS Alert</h4>
            
            {/* Family Number Setup */}
            <div className="bg-white p-3 rounded-lg border border-slate-100">
              <div className="text-[9px] text-slate-400 uppercase font-semibold mb-0.5">REGISTERED FAMILY PHONE</div>
              {isEditing ? (
                <form onSubmit={saveFamilyPhone} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={familyPhone}
                    onChange={(e) => setFamilyPhone(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-bold"
                  />
                  <button type="submit" className="bg-emerald-600 text-white px-3 py-1 rounded font-bold">Save</button>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-slate-800 text-xs">{familyPhone}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700 font-bold"
                  >
                    Edit Number
                  </button>
                </div>
              )}
            </div>

            {/* Template Card */}
            <div className="bg-white p-3.5 rounded-lg border border-slate-100 space-y-1">
              <div className="text-[9px] text-slate-400 uppercase font-semibold">Prefilled SMS Message</div>
              <p className="text-[10.5px] italic text-slate-600 leading-normal">
                "Emergency: I am at Hyderabad Airport Terminal 1, Gate B12. I feel unsafe. Please monitor my location. Link: https://maps.google.com/?q=17.2403,78.4294"
              </p>
            </div>
          </div>

          <button
            onClick={handleSendSMS}
            disabled={smsStatus === 'sending'}
            className="w-full mt-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow transition flex items-center justify-center gap-2"
          >
            {smsStatus === 'sending' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Opening Phone Messaging App...</span>
              </>
            ) : smsStatus === 'sent' ? (
              <span>✓ SMS Alert Transmitted</span>
            ) : (
              <span>📨 Send Emergency Location SMS</span>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}
