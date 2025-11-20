"use client";
import React, { useEffect, useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TrendingUp, Info } from "lucide-react";
import { getDataSimuladaRiqueza } from "@/lib/apiConnection";
import { useSimulation } from "@/context/SimulacionContext";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function RhoLineChart({
  title = "Equivalente Cierto para cada Rho",
}) {
  const { simulacionData } = useSimulation();
  const [dataUtilidad, setDataUtilidad] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDataUtilidad() {
      if (!simulacionData?.riqueza || !simulacionData?.inversionInicial || !simulacionData?.resultadosSimulacion) {
        console.log("Datos de simulación incompletos");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const newDataToSend = {
          riquezaInicial: simulacionData.riqueza,
          inversionInicial: simulacionData.inversionInicial,
          resultadoSimulacion: simulacionData.resultadosSimulacion,
        };

        const response = await getDataSimuladaRiqueza(newDataToSend, 10000);
       
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const responseJSON = await response.json();

        if (!responseJSON || (!responseJSON.utilidadEsperada && !responseJSON.utilidadDinero)) {
          throw new Error("Estructura de datos incorrecta en la respuesta");
        }

        setDataUtilidad({
          utilidadEsperada: responseJSON?.utilidadEsperada || {},
          utilidadDinero: responseJSON?.utilidadDinero || {}
        });

      } catch (err) {
        console.error("Error obteniendo datos de utilidad:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDataUtilidad();
  }, [simulacionData]);

  const getRhoLabel = (rhoKey) => {
    const rhoMap = {
      RHO_02: "ρ = 0.2",
      RHO_04: "ρ = 0.4",
      RHO_06: "ρ = 0.6",
      RHO_08: "ρ = 0.8",
      RHO_105: "ρ = 1.05",
      RHO_11: "ρ = 1.1",
      RHO_12: "ρ = 1.2",
      RHO_14: "ρ = 1.4",
      RHO_16: "ρ = 1.6",
      RHO_18: "ρ = 1.8",
      RHO_20: "ρ = 2.0",
    };
    return rhoMap[rhoKey] || rhoKey;
  };

  const chartData = useMemo(() => {
    if (!dataUtilidad || !dataUtilidad.utilidadDinero) {
      return [];
    }

    const rhoOrder = [
      "RHO_02",
      "RHO_04",
      "RHO_06",
      "RHO_08",
      "RHO_105",
      "RHO_11",
      "RHO_12",
      "RHO_14",
      "RHO_16",
      "RHO_18",
      "RHO_20",
    ];

    return rhoOrder
      .filter((rho) => {
        const value = dataUtilidad.utilidadDinero[rho];
        return value !== undefined && value !== null && !isNaN(value);
      })
      .map((rho) => ({
        rho,
        value: dataUtilidad.utilidadDinero[rho],
        label: getRhoLabel(rho),
      }));
  }, [dataUtilidad]);

  const chartOptions = useMemo(() => {
    if (chartData.length === 0) {
      return {
        chart: { type: "column", height: 500 },
        title: { text: "No hay datos disponibles" },
        series: []
      };
    }

    const values = chartData.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    const averageValue = values.reduce((a, b) => a + b, 0) / values.length;
    const isSmallRange = range < averageValue * 0.01;

    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 500,
        style: {
          fontFamily: "inherit",
        },
      },
      title: {
        text: null,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: chartData.map((item) => item.label),
        title: {
          text: "Nivel de Aversión al Riesgo (ρ)",
          style: {
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: "600",
          },
        },
        labels: {
          style: {
            color: "#6B7280",
            fontSize: "11px",
            fontWeight: "500",
          },
          rotation: -45,
        },
        gridLineColor: "#F3F4F6",
        gridLineWidth: 1,
        lineColor: "#E5E7EB",
        tickColor: "#E5E7EB",
      },
      yAxis: {
        title: {
          text: "Equivalente Cierto (S/.)",
          style: {
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: "600",
          },
        },
        labels: {
          style: {
            color: "#6B7280",
            fontSize: "11px",
          },
          formatter: function () {
            return isSmallRange 
              ? Highcharts.numberFormat(this.value, 2, ".", ",")
              : Highcharts.numberFormat(this.value, 0, ".", ",");
          },
        },
        min: isSmallRange ? minValue - range * 0.1 : null,
        max: isSmallRange ? maxValue + range * 0.1 : null,
        tickInterval: isSmallRange ? range * 0.1 : null, 
        gridLineColor: "#F3F4F6",
        gridLineWidth: 1,
        lineColor: "#E5E7EB",
      },
      series: [
        {
          name: "Equivalente Cierto",
          data: chartData.map((item) => ({
            y: item.value,
            name: item.label, 
          })),
          color: colors.accent,
          borderWidth: 0,
          borderRadius: 4,
          pointPadding: 0.05, 
          groupPadding: 0.05, 
          states: {
            hover: {
              brightness: 0.1,
              borderColor: colors.primary,
              borderWidth: 2
            }
          },
          dataLabels: {
            enabled: true,
            inside: false,
            style: {
              color: colors.primary,
              fontSize: "10px",
              fontWeight: "600",
              textOutline: "none"
            },
            formatter: function() {
              return  isSmallRange 
                ? Highcharts.numberFormat(this.y, 2, ".", ",")
                : Highcharts.numberFormat(this.y, 0, ".", ",");
            },
            verticalAlign: 'top',
            y: -20 
          }
        },
      ],
      tooltip: {
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        borderRadius: 8,
        borderWidth: 1,
        shadow: true,
        useHTML: true,
        formatter: function () {
          return `
            <div style="padding: 8px; min-width: 140px;">
              <div style="font-weight: 600; color: ${colors.primary}; margin-bottom: 4px;">
                ${this.point.name}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #6B7280;">Equivalente Cierto:</span>
                <span style="font-weight: 700; color: ${colors.accent};">
                  S/. ${Highcharts.numberFormat(this.y, 2, ".", ",")}
                </span>
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          animation: {
            duration: 1000,
          },
          pointWidth: 45, 
          colorByPoint: false,
          borderWidth: 0,
          grouping: false 
        },
      },
      legend: {
        enabled: false,
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              xAxis: {
                labels: {
                  rotation: -90,
                },
              },
              plotOptions: {
                column: {
                  pointWidth: 30, 
                  dataLabels: {
                    enabled: false 
                  }
                }
              }
            },
          },
        ],
      },
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
            {title}
          </h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
            {title}
          </h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
            {title}
          </h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            {simulacionData ? "No hay datos disponibles para mostrar" : "Esperando datos de simulación"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm">
            Equivalente cierto según diferentes valores de riesgo
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Gráfico de Barras</span>
        </div>
      </div>

      <div className="h-[500px] rounded-xl bg-white mb-6 border border-gray-100">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { height: "100%", width: "100%" } }}
        />
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">
              Relación Rho vs Equivalente Cierto
            </p>
            <p className="text-xs text-gray-600">
              Este gráfico muestra cómo el equivalente cierto disminuye a medida
              que aumenta el nivel de aversión al riesgo (ρ). Valores más altos
              de ρ indican mayor aversión al riesgo, resultando en menores
              equivalentes ciertos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}