import React, { useState } from 'react'

interface CheckInTask {
  id: string
  label: string
  detail: string
  isDone: boolean
}

export default function CheckInSteps() {
  const [tasks, setTasks] = useState<CheckInTask[]>([
    { id: 'web', label: 'Web Check-in', detail: 'Complete web check-in & select your seat online.', isDone: true },
    { id: 'bp', label: 'Download Boarding Pass', detail: 'Save the PDF pass or add it to your mobile wallet.', isDone: true },
    { id: 'tags', label: 'Print Baggage Tags', detail: 'Print bag tags at the airport self-service kiosks.', isDone: false },
    { id: 'drop', label: 'Self-baggage Drop', detail: 'Drop bags at the automated counter by scanning boarding pass.', isDone: false },
    { id: 'security', label: 'Security Clearance', detail: 'Place all metal, liquids, & laptops in tray for scanning.', isDone: false },
    { id: 'gate', label: 'Proceed to Gate B12', detail: 'Be at the gate 45 minutes prior to departure.', isDone: false }
  ])

  const doneCount = tasks.filter(t => t.isDone).length
  const totalCount = tasks.length
  const progressPercent = Math.round((doneCount / totalCount) * 100)

  // Current active step index
  const activeStepIdx = tasks.findIndex(t => !t.isDone) === -1 ? totalCount - 1 : tasks.findIndex(t => !t.isDone)

  function toggleTask(id: string) {
    setTasks(tasks.map(t => t.id === id ? { ...t, isDone: !t.isDone } : t))
  }

  return (
    <div className="space-y-6">
      
      {/* Interactive Boarding Pass Card */}
      <div className="bg-gradient-to-r from-blue-700 to-sky-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 transform origin-top-right"></div>
        <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-sky-600/20 rounded-full blur-2xl"></div>

        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider">BOARDING PASS</span>
            <span className="text-[10px] bg-sky-500/30 border border-sky-400/30 px-2 py-0.5 rounded-full font-bold">DIGITAL</span>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-sky-200 uppercase font-semibold">Flight Status</div>
            <div className="text-xs font-bold text-green-300 animate-pulse">BOARDING NOW</div>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center mb-6">
          <div>
            <div className="text-3xl font-black">HYD</div>
            <div className="text-[10px] text-sky-200">Hyderabad</div>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="text-xs text-sky-300">AI217</div>
            <div className="w-full flex items-center gap-1.5 my-1">
              <div className="h-0.5 flex-1 bg-white/20 border-dashed border-t"></div>
              <span className="text-sm">✈</span>
              <div className="h-0.5 flex-1 bg-white/20 border-dashed border-t"></div>
            </div>
            <div className="text-[9px] text-sky-200">Nonstop</div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-black text-right">DEL</div>
            <div className="text-[10px] text-sky-200">Delhi</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-white/10 py-4 mb-4 text-xs">
          <div>
            <div className="text-sky-300 font-semibold mb-0.5">PASSENGER</div>
            <div className="font-bold text-sm">Saivenkat</div>
          </div>
          <div>
            <div className="text-sky-300 font-semibold mb-0.5">GATE</div>
            <div className="font-bold text-sm">B12</div>
          </div>
          <div>
            <div className="text-sky-300 font-semibold mb-0.5">SEAT</div>
            <div className="font-bold text-sm">14A (Window)</div>
          </div>
          <div>
            <div className="text-sky-300 font-semibold mb-0.5">BOARDING TIME</div>
            <div className="font-bold text-sm">11:15 AM</div>
          </div>
        </div>

        {/* Mock Barcode */}
        <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl">
          <div className="h-10 w-full flex items-center justify-between tracking-tighter overflow-hidden text-slate-800 text-[10px] font-mono leading-none">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="h-full bg-slate-900"
                style={{
                  width: `${(i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 2)}px`,
                  opacity: i % 7 === 0 ? 0 : 1
                }}
              ></div>
            ))}
          </div>
          <div className="text-[9px] font-mono text-slate-400 mt-1 select-all">*AI-SV-14A-HYDDEL*</div>
        </div>
      </div>

      {/* Checklist and Timeline Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">Check-in Steps</h3>
            <p className="text-xs text-slate-400">Complete tasks to navigate to your gate smoothly.</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              {doneCount}/{totalCount} Done
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Task Lists */}
        <div className="space-y-3">
          {tasks.map((task, idx) => {
            const isCurrent = idx === activeStepIdx
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                  task.isDone
                    ? 'bg-slate-50/50 border-slate-200 opacity-70 hover:opacity-90'
                    : isCurrent
                    ? 'bg-blue-50/30 border-blue-200 shadow-sm ring-1 ring-blue-100'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.isDone
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isCurrent
                      ? 'border-blue-500 bg-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {task.isDone && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${task.isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.label}
                    </span>
                    {isCurrent && !task.isDone && (
                      <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                        Current Step
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mt-0.5 ${task.isDone ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                    {task.detail}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
