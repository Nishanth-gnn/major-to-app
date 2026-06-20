import React from 'react'
import { Link } from 'react-router-dom'

export default function QuickActionCard({ action }: { action: any }){
  return (
    <Link to={action.to} className="bg-white rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">{action.title.charAt(0)}</div>
      <div className="text-sm font-medium text-slate-900">{action.title}</div>
      {action.badge && <div className="mt-1 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">{action.badge}</div>}
    </Link>
  )
}
