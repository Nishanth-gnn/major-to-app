import React from 'react'

export default function Timeline({ steps }: { steps: string[] }){
  return (
    <div className="overflow-x-auto">
      <div className="flex items-center gap-6 py-2">
        {steps.map((s,i)=> (
          <div key={i} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">{i+1}</div>
              {i < steps.length -1 && <div className="h-6 border-r border-slate-200 ml-0" style={{height:40}} />}
            </div>
            <div>
              <div className="font-medium">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
