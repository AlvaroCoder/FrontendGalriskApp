"use client";
import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { TrendingUp } from "lucide-react";
import { extraerValoresPorAtributo } from "@/common/extractValueEscenarios";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function VariablesChart({ title = "", data = [] }) {
  const [currentData, setCurrentData] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetsData, setSheetsData] = useState([]);

  useEffect(() => {
    function configCharts() {
      if (data && data.length > 0) {
        const columnas = Object.keys(data[0]).filter((item) => item !== "VAN");
        setSheetsData(columnas);
        
        if (columnas.length > 0) {
          const firstSheet = columnas[0];
          setSelectedSheet(firstSheet);
          const extractedData = extraerValoresPorAtributo(data, firstSheet);
          setCurrentData(extractedData || []);
        }
      }
    }
    configCharts();
  }, [data]);

  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
    const extractedData = extraerValoresPorAtributo(data, sheetName);
    setCurrentData(extractedData || []);
  };
    
  const chartOptions = useMemo(() => {
    if (!currentData || currentData.length === 0) {
      return {
        chart: {
          type: 'column',
          backgroundColor: 'transparent',
          height: 350
        },
        title: {
          text: 'No hay datos disponibles',
          style: {
            color: '#6B7280',
            fontSize: '16px'
          }
        },
        series: [{
          data: []
        }]
      };
    }

    const min = Math.min(...currentData);
    const max = Math.max(...currentData);
    const numBins = 20;
    const binSize = (max - min) / numBins;

    const bins = Array(numBins).fill(0);
    currentData.forEach((v) => {
      const index = Math.min(
        Math.floor((v - min) / binSize),
        numBins - 1
      );
      bins[index]++;
    });

    // Calcular medias de los bins para el eje X
    const binMeans = Array.from({ length: numBins }, (_, i) => {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      return (binStart + binEnd) / 2;
    });

    // Determinar colores por bin (rojo para negativos, naranja para positivos)
    const binColors = binMeans.map(mean => 
      mean < 0 
        ? {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#EF4444'],
              [1, '#DC2626']
            ]
          }
        : {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, '#FFC525'],
              [1, '#F59E0B']
            ]
          }
    );

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'inherit'
        }
      },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      xAxis: {
        title: {
          text: `Valor de ${selectedSheet}`,
          style: {
            color: '#6B7280',
            fontSize: '12px'
          }
        },
        categories: binMeans.map(mean => mean.toFixed(2)),
        labels: {
          style: {
            color: '#6B7280',
            fontSize: '10px'
          },
          rotation: -45
        },
        crosshair: true,
        tickLength: 0
      },
      yAxis: {
        title: {
          text: 'Frecuencia',
          style: {
            color: '#6B7280',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            color: '#6B7280',
            fontSize: '11px'
          }
        },
        gridLineColor: '#F3F4F6',
        min: 0
      },
      tooltip: {
        formatter: function() {
          const binIndex = this.point.index;
          const binStart = min + binIndex * binSize;
          const binEnd = binStart + binSize;
          const frequency = this.y;
          
          return `
            <b>Media del Bin:</b> ${binMeans[binIndex].toFixed(2)}<br/>
            <b>Rango:</b> ${binStart.toFixed(2)} - ${binEnd.toFixed(2)}<br/>
            <b>Frecuencia:</b> ${frequency} escenarios
          `;
        }
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          borderRadius: 2,
          pointPadding: 0,
          groupPadding: 0.1,
          colorByPoint: true,
          colors: binColors
        }
      },
      series: [{
        name: 'Frecuencia',
        type: 'column',
        data: bins.map((count, index) => ({
          y: count,
          color: binColors[index]
        }))
      }],
      legend: {
        enabled: false
      }
    };
  }, [currentData, selectedSheet]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Histogramas de Variables</span>
        </div>
      </div>

      <div className="h-96 rounded-xl bg-white mb-4">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { height: '100%', width: '100%' } }}
        />
      </div>

      <div className="bg-gray-100 px-6 py-3 rounded-xl border border-gray-200 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {sheetsData.map((sheet, index) => (
            <button
              key={index}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                flex items-center gap-2 min-w-[120px] justify-center
                border-2 hover:scale-105 active:scale-95
                ${
                  selectedSheet === sheet
                    ? "bg-white border-accent shadow-md text-gray-800 font-semibold"
                    : "bg-gray-200 border-transparent text-gray-600 hover:bg-gray-300"
                }
              `}
              onClick={() => handleSheetChange(sheet)}
              style={{
                borderColor: selectedSheet === sheet ? colors.accent : undefined
              }}
            >
              <div className={`
                w-2 h-2 rounded-full
                ${selectedSheet === sheet ? 'bg-accent' : 'bg-gray-400'}
              `} style={{
                backgroundColor: selectedSheet === sheet ? colors.accent : undefined
              }} />
              <span className="truncate">{sheet}</span>
            </button>
          ))}
        </div>
      </div>

      {currentData.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-gray-700">Variable: </span>
              <span className="text-gray-600">{selectedSheet}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Escenarios: </span>
              <span className="text-gray-600">{currentData.length}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Rango: </span>
              <span className="text-gray-600">
                {Math.min(...currentData).toFixed(2)} - {Math.max(...currentData).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4 text-xs text-gray-600 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#FFC525]"></div>
            <span>Valores Positivos</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#EF4444]"></div>
            <span>Valores Negativos</span>
          </div>
        </div>
      </div>
    </div>
  );
}