import { downloadSimulationResults } from "@/lib/apiConnection";
import { Download } from "lucide-react";
import React, { useState } from "react";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function DownloadButton({
  simulationData,
  loading = false,
  disabled = false,
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!simulationData || disabled) return;
    try {
      setIsDownloading(true);

      const downloadData = {
        rutaExcel: simulationData.rutaExcel,
        celdaObjetivo: simulationData.metadata?.celda,
        hojaObjetivo: simulationData.metadata?.hoja,
        variables: simulationData.metadata?.variables,
        topResultados: simulationData.topResultados || [],
      };

      await downloadSimulationResults(downloadData);

      console.log("Excel descargado correctamente");
    } catch (error) {
      console.log(error);

      console.error("Error al descargar Excel:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <button
      onClick={handleDownload}
      disabled={loading || isDownloading || disabled || !simulationData}
      className="
        px-6 py-3 rounded-xl font-semibold transition-all duration-300
        flex items-center justify-center gap-3 hover:shadow-lg active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        w-full"
      style={{
        backgroundColor: colors.accent,
        color: colors.primary,
      }}
    >
      <Download className="w-5 h-5" />
      {isDownloading ? "Generando Excel..." : "Descargar Excel"}
    </button>
  );
}
