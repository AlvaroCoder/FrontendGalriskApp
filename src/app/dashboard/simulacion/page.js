"use client";
import { useSimulation } from "@/context/SimulacionContext";
import DownloadButton from "@/elements/Buttons/DownloadButton";
import MetricCard from "@/elements/Card/MetricCard";
import { getDataSimuladaRiqueza } from "@/lib/apiConnection";
import HistogramChart from "@/views/Charts/HistogramChart";
import RhoVariablesChart from "@/views/Charts/RhoChart";
import RhoLineChart from "@/views/Charts/RhoLineChart";
import VariablesChart from "@/views/Charts/VariablesChart";
import LoadingPage from "@/views/Loading/LoadingPage";
import {
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [dataVanActual, setDataVanActual] = useState(null);
  const [escenriosData, setEscenriosData] = useState(null);

  const { simulacionData } = useSimulation();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!simulacionData) {
        router.back();
        return;
      }

      try {
        setLoading(true);
        const {
          riqueza: riquezaInicial,
          resultadosSimulacion,
          inversionInicial,
          valorActual,
          escenarios,
        } = simulacionData;
        console.log({
          riquezaInicial,
          resultadosSimulacion,
          inversionInicial,
          valorActual,
          escenarios,
        });

        const response = await getDataSimuladaRiqueza(
          {
            riquezaInicial,
            inversionInicial,
            resultadosSimulacion,
          },
          10000
        );
        const responseJSON = await response.json();
        console.log(responseJSON);

        setDataVanActual(valorActual);
        setEscenriosData(escenarios);
      } catch (err) {
        toast("Surgió un error al procesar los datos", {
          type: "error",
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [simulacionData, router]);

  if (loading) {
    return <LoadingPage loading={loading} />;
  }

  return (
    <div
      className="min-h-screen p-6 transition-all duration-300"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Resultados de Simulación
          </h1>
          <p className="text-lg text-gray-600">
            Análisis detallado de los escenarios generados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Escenarios Simulados
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Se generaron{" "}
                    <span
                      className="font-semibold"
                      style={{ color: colors.accent }}
                    >
                      10,000 escenarios
                    </span>{" "}
                    con análisis de sensibilidad del VAN
                  </p>
                  <div className="">
                    <DownloadButton
                      simulationData={simulacionData?.dataToProcess}
                      loading={loading}
                      disabled={false}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Incluye todos los datos y análisis
                    </p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard
                      title="Total Escenarios"
                      value="10,000"
                      subtitle="Simulaciones VAN"
                      icon={<Users className="w-6 h-6" />}
                      color="blue"
                    />
                    <MetricCard
                      title="Inversión Inicial"
                      value={`S/. ${
                        simulacionData?.inversionInicial?.toLocaleString() ||
                        "0"
                      }`}
                      subtitle="Monto base"
                      icon={<Target className="w-6 h-6" />}
                      color="green"
                    />
                    <MetricCard
                      title="Riqueza Inicial"
                      value={`S/. ${
                        simulacionData?.riqueza?.toLocaleString() || "0"
                      }`}
                      subtitle="Capital disponible"
                      icon={<TrendingUp className="w-6 h-6" />}
                      color="orange"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <HistogramChart
                data={simulacionData?.resultadosSimulacion}
                dataVanActual={dataVanActual}
                title="Distribución de la celda objetivo"
              />
              <VariablesChart
                title="Distribuciones de Variables"
                data={escenriosData}
              />
              <RhoVariablesChart />
              <RhoLineChart />
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx global>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
