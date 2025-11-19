"use client";
import {
  BarChart3,
  Calendar,
  PieChart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function SideBarNavigation() {
    const router = useRouter();

  const [activeSection, setActiveSection] = useState("resumen");

  const sections = [
    { id: "resumen",route : "/dashboard/simulacion", title: "Resumen General", icon: BarChart3 },
    { id: "histograma", route : "/dashboard/simulacion", title: "Histograma VAN", icon: TrendingUp },
    { id: "distribucion", route : "/dashboard/simulacion", title: "Distribución", icon: PieChart },
    { id: "escenarios", route : "/dashboard/simulacion/escenarios" , title: "Escenarios", icon: Users },
    { id: "analisis", route : "/dashboard/simulacion",title: "Análisis", icon: Target },
    { id: "temporal", route : "/dashboard/simulacion",title: "Serie Temporal", icon: Calendar },
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
            onClick={() => {
                setActiveSection(section.id);
                router.push(section.route)
            }}
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