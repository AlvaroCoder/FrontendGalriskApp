import { FileSpreadsheet } from "lucide-react";
import React from "react";
import CardExcel from "@/elements/Card/CardExcel";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
  text: "#4B5563",
  success: "#21A366"
};


export default function ListCardExcels({ excelsData = [], handleDeleteExcel }) {

  if (!excelsData?.length) {
    return (
      <div className="w-full max-w-5xl mt-8 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 bg-white">
        <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>
          No hay archivos Excel
        </h3>
        <p className="text-gray-600 mb-4">
          Comienza subiendo tu primer archivo Excel para analizar
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mt-8 bg-white p-4 rounded-xl shadow-lg">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-accent/10">
            <FileSpreadsheet className="w-6 h-6" style={{ color: colors.accent }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
            Tus Proyectos Excel
          </h2>
        </div>
        <p className="text-gray-600">
          Gestiona y analiza tus archivos de simulación financiera
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {excelsData.map((item, key) => (
            <CardExcel
                key={key}
                item={item}
                handleDeleteExcel={handleDeleteExcel}
            />
        ))}
      </section>

      <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20">
        <p className="text-sm text-center font-medium" style={{ color: colors.primary }}>
          📊 <strong>Tip:</strong> Cada proyecto puede contener múltiples escenarios de simulación
        </p>
      </div>
    </div>
  );
}