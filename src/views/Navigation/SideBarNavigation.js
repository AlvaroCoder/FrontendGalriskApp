"use client";
import {
  BarChart3,
  Calendar,
  PieChart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function SideBarNavigation() {
  const [activeSection, setActiveSection] = useState("resumen");

  const sections = [
    { id: "resumen", title: "Resumen General", icon: BarChart3 },
    { id: "histograma", title: "Histograma VAN", icon: TrendingUp },
    { id: "distribucion", title: "Distribución", icon: PieChart },
    { id: "escenarios", title: "Escenarios", icon: Users },
    { id: "analisis", title: "Análisis", icon: Target },
    { id: "temporal", title: "Serie Temporal", icon: Calendar },
  ];

  return (
    <nav className="
      w-64 bg-white h-screen shadow-lg p-4 
      sticky top-0 overflow-y-auto
      flex flex-col
    ">
      <div className="flex-shrink-0">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Análisis
        </h3>
      </div>
      
      <div className="flex-1 space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              w-full text-left px-3 py-2 rounded-lg transition-all duration-200
              flex items-center gap-3
              ${
                activeSection === section.id
                  ? "bg-accent/20 text-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
            style={{
              backgroundColor:
                activeSection === section.id
                  ? `${colors.accent}20`
                  : undefined,
              color: activeSection === section.id ? colors.primary : undefined,
            }}
          >
            <section.icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{section.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}