"use client";
import {
  BarChart3,
  Table,
  ChevronLeft,
  ChevronRight,
  BarChart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function SideBarNavigation() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("resumen");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const sections = [
    { id: "resumen", route: "/dashboard/simulacion", title: "Resumen General", icon: BarChart3 },
    { id: "escenarios", route: "/dashboard/simulacion/escenarios", title: "Escenarios", icon: Table }, ,
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`
      bg-white h-screen shadow-lg p-4 
      sticky top-0 overflow-y-auto overflow-x-hidden
      flex flex-col transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      ${isMobile ? 'fixed z-50' : 'relative'}
    `}>
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        {!isCollapsed && (
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Análisis
          </h3>
        )}
        
        <button
          onClick={toggleSidebar}
          className={`
            p-1 rounded-lg transition-all duration-200 hover:bg-gray-100
            ${isCollapsed ? 'mx-auto' : ''}
          `}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="flex-1 space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSection(section.id);
              router.push(section.route);
              if (isMobile) {
                setIsCollapsed(true);
              }
            }}
            className={`
              w-full text-left rounded-lg transition-all duration-200
              flex items-center gap-3 group relative
              ${
                activeSection === section.id
                  ? "bg-accent/20 text-primary font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }
              ${isCollapsed ? 'px-2 py-3 justify-center' : 'px-3 py-2'}
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
            
            {!isCollapsed && (
              <span className="truncate">{section.title}</span>
            )}
            
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                {section.title}
              </div>
            )}
          </button>
        ))}
      </div>

      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </nav>
  );
}