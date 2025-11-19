'use client'
import React from "react";
import { Calendar, ArrowRight, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
  text: "#4B5563",
};

export default function WelcomeCard({ userData }) {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const router = useRouter();

  return (
    <div className="w-full max-w-5xl rounded-2xl p-6 shadow-lg border border-gray-100 bg-gradient-to-br from-white to-gray-50/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/10">
            <Sparkles className="w-6 h-6" style={{ color: colors.accent }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              ¡Bienvenido{userData?.username ? `, ${userData.username}` : ""}! 👋
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" style={{ color: colors.text }} />
              <span
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {currentDate}
              </span>
            </div>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
          <span className="text-sm font-medium text-green-700 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            En línea
          </span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-lg mb-3" style={{ color: colors.text }}>
          Estás a un paso de optimizar tu proyecto financiero.
          <span className="font-semibold" style={{ color: colors.primary }}>
            {" "}
            Comienza con el análisis de sensibilidad
          </span>
        </p>

        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: colors.text }}
        >
          <ArrowRight className="w-4 h-4" />
          <span>
            Selecciona las variables clave y ejecuta la simulación para ver
            resultados
          </span>
        </div>

        <button
          onClick={() => router.push("/dashboard/upload")}
          className="
                      w-full 
                      py-3 
                      mb-6
                      mt-4
                      px-4 
                      rounded-xl 
                      font-semibold 
                      transition-all 
                      duration-300 
                      hover:shadow-lg 
                      hover:scale-105 
                      active:scale-95
                      flex 
                      items-center 
                      justify-center 
                      gap-2
                    "
          style={{
            backgroundColor: "#FFC525",
            color: "#1B263B",
          }}
        >
          <p className="flex flex-row gap-4">
            <Upload /> Subir proyecto
          </p>
        </button>
      </div>



      <div className="mt-6 p-3 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20">
        <p
          className="text-sm text-center font-medium"
          style={{ color: colors.primary }}
        >
          💡 <strong>Tip:</strong> Cuantas más variables incluyas, más preciso
          será tu análisis
        </p>
      </div>
    </div>
  );
}
