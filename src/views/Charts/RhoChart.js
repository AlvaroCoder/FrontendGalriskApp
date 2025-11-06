"use client";
import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TrendingUp, Filter, Download, Info, ScatterChart } from "lucide-react";
import { useSimulation } from "@/context/SimulacionContext";
import { getDataSimuladaRiqueza } from "@/lib/apiConnection";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function RhoVariablesChart({
  title = "Distribución de Variables Rho vs Riqueza",
}) {
  const [selectedRhos, setSelectedRhos] = useState([]);
  const [showAllRhos, setShowAllRhos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  const { simulacionData } = useSimulation();

  const rhoDefinitions = useMemo(() => [
    { key: "RHO_02", name: "ρ = 0.2", color: "#FF6B6B" },
    { key: "RHO_04", name: "ρ = 0.4", color: "#4ECDC4" },
    { key: "RHO_06", name: "ρ = 0.6", color: "#45B7D1" },
    { key: "RHO_08", name: "ρ = 0.8", color: "#96CEB4" },
    { key: "RHO_105", name: "ρ = 1.05", color: "#FFEAA7" },
    { key: "RHO_11", name: "ρ = 1.1", color: "#DDA0DD" },
    { key: "RHO_12", name: "ρ = 1.2", color: "#98D8C8" },
    { key: "RHO_14", name: "ρ = 1.4", color: "#F7DC6F" },
    { key: "RHO_16", name: "ρ = 1.6", color: "#BB8FCE" },
    { key: "RHO_18", name: "ρ = 1.8", color: "#85C1E9" },
    { key: "RHO_20", name: "ρ = 2.0", color: "#F8C471" }
  ], []);

  useEffect(() => {
    if (rhoDefinitions.length > 0 && selectedRhos.length === 0) {
      setSelectedRhos(rhoDefinitions.slice(0, 1).map(rho => rho.key));
    }
  }, [rhoDefinitions, selectedRhos]);

  useEffect(() => {
    async function fetchDataSimuladaRiqueza() {
      if (!simulacionData) return;

      try {
        setLoading(true);
        setError(null);

        const newDataToSend = {
          riquezaInicial: simulacionData?.riqueza,
          inversionInicial: simulacionData?.inversionInicial,
          resultadosVAN: simulacionData?.resultadosVAN,
        };

        const response = await getDataSimuladaRiqueza(newDataToSend, 10000);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const responseJSON = await response.json();
        console.log("Datos para scatter chart:", responseJSON);

        if (!responseJSON.valoresBaseRiqueza || !responseJSON.matrizRho) {
          throw new Error("Datos incompletos en la respuesta");
        }
        
        setChartData({
          valoresBaseRiqueza: responseJSON.valoresBaseRiqueza,
          matrizRho: responseJSON.matrizRho
        });

      } catch (err) {
        console.error("Error obteniendo datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDataSimuladaRiqueza();
  }, [simulacionData]);

  const toggleRhoSelection = (rhoKey) => {
    setSelectedRhos(prev => 
      prev.includes(rhoKey)
        ? prev.filter(key => key !== rhoKey)
        : [...prev, rhoKey]
    );
  };

  const selectAllRhos = () => {
    setSelectedRhos(rhoDefinitions.map(rho => rho.key));
  };

  const clearSelection = () => {
    setSelectedRhos([]);
  };

  const chartOptions = useMemo(() => {
    if (loading) {
      return {
        chart: {
          type: 'scatter',
          backgroundColor: 'transparent',
          height: 500
        },
        title: {
          text: 'Cargando datos...',
          style: {
            color: '#6B7280',
            fontSize: '16px'
          }
        },
        series: []
      };
    }

    if (error || !chartData) {
      return {
        chart: {
          type: 'scatter',
          backgroundColor: 'transparent',
          height: 500
        },
        title: {
          text: error ? 'Error al cargar los datos' : 'No hay datos disponibles',
          style: {
            color: '#EF4444',
            fontSize: '16px'
          }
        },
        subtitle: {
          text: error || 'Esperando datos de simulación',
          style: {
            color: '#6B7280',
            fontSize: '12px'
          }
        },
        series: []
      };
    }

    if (selectedRhos.length === 0) {
      return {
        chart: {
          type: 'scatter',
          backgroundColor: 'transparent',
          height: 500
        },
        title: {
          text: 'Selecciona variables Rho para visualizar',
          style: {
            color: '#6B7280',
            fontSize: '16px'
          }
        },
        series: []
      };
    }

    const { valoresBaseRiqueza, matrizRho } = chartData;

    const series = selectedRhos.map(rhoKey => {
      const rhoDef = rhoDefinitions.find(rho => rho.key === rhoKey);
      
      // Crear pares de datos (x, y) para el scatter plot
      const dataPoints = matrizRho.map((rhoValues, index) => {
        const x = valoresBaseRiqueza[index]; // Eje X: valores base de riqueza
        const y = rhoValues[rhoKey]; // Eje Y: valor del rho
        
        // Solo incluir puntos con valores válidos
        if (x != null && y != null && !isNaN(x) && !isNaN(y) && isFinite(x) && isFinite(y)) {
          return [x, y];
        }
        return null;
      }).filter(point => point !== null);

      return {
        name: rhoDef?.name || rhoKey,
        data: dataPoints,
        color: rhoDef?.color || colors.accent,
        marker: {
          symbol: 'circle',
          radius: 3,
          
        },
        states: {
          hover: {
            marker: {
              radius: 5,
              lineWidth: 2
            }
          }
        }
      };
    }).filter(series => series.data.length > 0);

    return {
      chart: {
        type: 'scatter',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'inherit'
        },
        zoomType: 'xy'
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      xAxis: {
        title: {
          text: 'Valor Base de Riqueza (VAN + Riqueza Inicial + Inversión)',
          style: {
            color: '#6B7280',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            color: '#6B7280',
            fontSize: '11px'
          },
          formatter: function() {
            return this.value.toLocaleString('es-ES', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            });
          }
        },
        gridLineColor: '#F3F4F6',
        tickLength: 0,
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: 'Valor de Utilidad Rho',
          style: {
            color: '#6B7280',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            color: '#6B7280',
            fontSize: '11px'
          },
          formatter: function() {
            return this.value.toFixed(2);
          }
        },
        gridLineColor: '#F3F4F6'
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: 'Riqueza: <b>{point.x:,.0f}</b><br>Utilidad: <b>{point.y:.4f}</b>',
        shared: false
      },
      plotOptions: {
        scatter: {
          animation: {
            duration: 1000
          }
        }
      },
      series: series,
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        itemStyle: {
          color: '#6B7280',
          fontSize: '11px'
        },
        itemHoverStyle: {
          color: colors.primary
        }
      },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };
  }, [chartData, selectedRhos, rhoDefinitions, loading, error]);

  const visibleRhos = showAllRhos ? rhoDefinitions : rhoDefinitions.slice(0, 6);

  if (loading && !chartData) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200  rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-96 bg-gray-100 rounded-xl mb-6"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
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
            {error 
              ? "Error al cargar los datos" 
              : `Distribución de ${chartData?.matrizRho?.length || 0} puntos por variable Rho`
            }
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ScatterChart className="w-4 h-4" />
          <span>Gráfico de Dispersión</span>
        </div>
      </div>

      <div className="h-96 rounded-xl bg-white mb-6 border border-gray-100">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { height: '100%', width: '100%' } }}
        />
      </div>

      {!error && chartData && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Seleccionar Variables Rho</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAllRhos}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Todos
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={() => setShowAllRhos(!showAllRhos)}
                className="px-3 py-1 text-xs bg-accent text-primary rounded-lg hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                {showAllRhos ? 'Menos' : 'Más'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {visibleRhos.map((rho) => (
              <button
                key={rho.key}
                onClick={() => toggleRhoSelection(rho.key)}
                disabled={loading}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200 text-left
                  flex items-center gap-2 hover:scale-105 active:scale-95
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  ${selectedRhos.includes(rho.key)
                    ? 'border-accent bg-accent/10 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
                style={{
                  borderColor: selectedRhos.includes(rho.key) ? colors.accent : undefined
                }}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: rho.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {rho.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {rho.key}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="text-gray-600">
              {selectedRhos.length} de {rhoDefinitions.length} seleccionadas
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-3 h-3 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 mb-1">
              Gráfico de Dispersión Rho vs Riqueza
            </p>
            <p className="text-xs text-gray-600">
              Este gráfico muestra la relación entre el valor base de riqueza (eje X) y 
              las utilidades calculadas para diferentes niveles de aversión al riesgo Rho (eje Y).
              Cada punto representa una simulación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}