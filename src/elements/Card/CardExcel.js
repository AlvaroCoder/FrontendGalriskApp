import { ArrowRight, Calendar, Download, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
  text: "#4B5563",
  success: "#21A366"
};

const ExcelIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke={colors.success}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke={colors.success}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 13H8"
      stroke={colors.success}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 17H8"
      stroke={colors.success}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 9H9H8"
      stroke={colors.success}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export default function CardExcel({
    handleDeleteExcel,
    item={}
}) {
    const router = useRouter();

  return (
          <div className="group relative">
            <div
              className="
                relative 
                bg-white 
                rounded-2xl 
                p-6 
                border 
                border-gray-100
                hover:shadow-2xl 
                hover:-translate-y-1 
                transition-all 
                duration-300 
                ease-out
                h-full
                flex 
                flex-col
                bg-gradient-to-br from-white to-gray-50/30
              "
            >
              <button
                onClick={() => handleDeleteExcel(item?.id)}
                className="
                  absolute 
                  -top-2 
                  -right-2 
                  w-8 
                  h-8 
                  rounded-full 
                  flex 
                  items-center 
                  justify-center 
                  transition-all 
                  duration-300 
                  hover:scale-110 
                  shadow-lg
                  z-10
                  opacity-0 
                  group-hover:opacity-100
                "
                style={{ backgroundColor: "#EF4444" }}
              >
                <Trash className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <ExcelIcon />
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.primary,
                  }}
                >
                  ID: {item.id}
                </span>
              </div>

              <div className="flex-grow mb-4">
                <h3
                  className="text-lg font-bold mb-3 line-clamp-2"
                  style={{ color: colors.primary }}
                >
                  {item.nombre_excel}
                </h3>

                {item.descripcion && (
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">
                    {item.descripcion}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {item.fecha_procesado
                      ? new Date(item.fecha_procesado).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Fecha no disponible"}
                  </div>
                  
                  {item.tamano && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Download className="w-4 h-4 mr-2" />
                      {item.tamano}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => router.push(`/dashboard/excel/?idExcel=${item.id}`)}
                className="
                  w-full 
                  py-3 
                  px-4 
                  rounded-xl 
                  font-semibold 
                  transition-all 
                  duration-300 
                  hover:shadow-lg 
                  active:scale-95
                  flex 
                  items-center 
                  justify-center 
                  gap-2
                  group/btn
                "
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                }}
              >
                Analizar Proyecto
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>

            <div
              className="
                absolute 
                inset-0 
                rounded-2xl 
                opacity-0 
                group-hover:opacity-100 
                transition-opacity 
                duration-300 
                pointer-events-none
                bg-gradient-to-r 
                from-transparent 
                via-accent/5 
                to-transparent
                -z-10
              "
            />
          </div>
  )
};