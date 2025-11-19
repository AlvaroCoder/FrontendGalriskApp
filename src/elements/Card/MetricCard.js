import React from 'react'

export default function MetricCard({ title, value, subtitle, icon, color = "blue" }) {
  return (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div
        className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        group-hover:scale-110 transition-transform duration-300
        ${color === "blue" ? "bg-blue-50 text-blue-600" : ""}
        ${color === "green" ? "bg-green-50 text-green-600" : ""}
        ${color === "orange" ? "bg-orange-50 text-orange-600" : ""}
        ${color === "purple" ? "bg-purple-50 text-purple-600" : ""}
      `}
      >
        {icon}
      </div>
    </div>
  </div>
  )
}
;