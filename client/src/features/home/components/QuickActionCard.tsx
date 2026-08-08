import React from 'react'
import { Link } from 'react-router-dom'

export default function QuickActionCard({ action }: { action: any }){
  return (
    <Link to={action.to} className="bg-white dark:bg-slate-800 rounded-xl p-3 flex flex-col items-center justify-center shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-98 transition-all">
      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2 text-xl font-bold">
        {action.icon ? action.icon : [...action.title][0]}
      </div>
      <div className="text-sm font-medium text-slate-900 dark:text-white text-center truncate w-full">{action.title}</div>
      {action.badge && <div className="mt-1 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">{action.badge}</div>}
    </Link>
  )
}
