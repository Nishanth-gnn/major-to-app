import React, { useState } from 'react'

export default function DiscreetReporter() {
  const [location, setLocation] = useState('washrooms')
  const [incidentType, setIncidentType] = useState('stalking')
  const [description, setDescription] = useState('')
  const [isPlainclothes, setIsPlainclothes] = useState(true)
  const [isUrgent, setIsUrgent] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate network latency
    setTimeout(() => {
      setLoading(false)
      setIsSubmitted(true)
    }, 800)
  }

  const resetForm = () => {
    setDescription('')
    setIsSubmitted(false)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Discreet Incident Reporter</h3>
          <p className="text-xs text-slate-400">Report stalking, harassment, or suspicious actions quietly to airport guards.</p>
        </div>
      </div>

      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Exact Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="washrooms">🚽 Washrooms Area (near Gates)</option>
                <option value="dutyfree">🛒 Duty Free / Shopping Lane</option>
                <option value="gate_lounge">💺 Gate B1-B15 Lounge</option>
                <option value="foodcourt">🍔 Food Court Mezzanine</option>
                <option value="baggage_claim">🧳 Baggage Claim Carousel 3/4</option>
                <option value="other">📍 Other (Specify in notes)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Incident Category</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="stalking">👣 Being followed / Stalked</option>
                <option value="harassment">⚠️ Verbal / Physical Harassment</option>
                <option value="suspicious">🕵️ Suspicious Person / Activity</option>
                <option value="theft">🎒 Baggage Theft / Tampering</option>
                <option value="other">📝 Other Emergency Help</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Physical Description & Details</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Tall man in green hoodie, hovering near ladies restroom door for 15 minutes. Stalked me when I walked out."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
            ></textarea>
          </div>

          {/* Checkbox settings */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPlainclothes}
                onChange={(e) => setIsPlainclothes(e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
              />
              <div>
                <span className="font-bold text-slate-700 text-xs">Request Plainclothes Officer Response</span>
                <p className="text-[10px] text-slate-400">Officer will arrive in civil clothes to handle the case discreetly without drawing attention.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer border-t border-slate-200/50 pt-2.5">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
              />
              <div>
                <span className="font-bold text-slate-700 text-xs">High Urgency Level</span>
                <p className="text-[10px] text-slate-400">Send an immediate guard dispatch to my GPS coordinate position.</p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Logging Discreet Report...</span>
              </>
            ) : (
              <span>🔒 Submit Discreet Incident Report</span>
            )}
          </button>
          
        </form>
      ) : (
        /* Success Screen */
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center text-2xl mx-auto">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Report Successfully Logged</h4>
            <p className="text-xs text-slate-400 mt-1">Airport Security Control Room has received your incident report.</p>
          </div>

          <div className="bg-white border border-slate-100 p-4 rounded-xl text-left text-xs leading-relaxed space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">TICKET ID:</span>
              <span className="font-mono font-bold text-slate-700">SEC-{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">DISPATCH TYPE:</span>
              <span className="font-bold text-slate-700">{isPlainclothes ? 'Plainclothes Officer' : 'Uniformed Guards'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">ETA:</span>
              <span className="font-bold text-red-500 animate-pulse">Under 2 Minutes</span>
            </div>
            <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 mt-1">
              Keep your phone handy. Security agents might reach out via direct SMS for real-time location. Remain in visible public locations.
            </p>
          </div>

          <button
            onClick={resetForm}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
          >
            File Another Report
          </button>
        </div>
      )}
    </div>
  )
}
