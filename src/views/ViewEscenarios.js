'use client';
import React, { useMemo } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { extraerValoresPorAtributo } from '@/common/extractValueEscenarios';

export default function ViewEscenarios({ escenarios = [] }) {
  
  const columnas = escenarios.length > 0 ? Object.keys(escenarios[0]) : [];

  const chartsData = useMemo(() => {
    if (escenarios.length === 0) return [];

    return columnas.map((col) => {
      const valores = extraerValoresPorAtributo(escenarios, col);

      const min = Math.min(...valores);
      const max = Math.max(...valores);
      const numBins = 20; 
      const binSize = (max - min) / numBins;

      const bins = Array(numBins).fill(0);
      valores.forEach((v) => {
        const index = Math.min(
          Math.floor((v - min) / binSize),
          numBins - 1
        ); 
        bins[index]++;
      });

      const categories = bins.map((_, i) => {
        const start = (min + i * binSize).toFixed(2);
        const end = (min + (i + 1) * binSize).toFixed(2);
        return `${start} - ${end}`;
      });

      return {
        variable: col,
        options: {
          chart: {
            type: 'column',
            backgroundColor: 'transparent',
            height: 300
          },
          title: {
            text: `Histograma de ${col}`
          },
          xAxis: {
            categories: categories,
            title: { text: 'Rangos' },
            labels: { rotation: -45 }
          },
          yAxis: {
            min: 0,
            title: { text: 'Frecuencia' }
          },
          series: [
            {
              name: 'Frecuencia',
              data: bins,
              color: '#4F46E5'
            }
          ],
          credits: { enabled: false }
        }
      };
    });
  }, [escenarios, columnas]);

  return (
    <section className="p-4 w-full grid grid-cols-3 gap-4">
      <div className="col-span-1 border border-nigth-blue rounded-lg shadow bg-white p-3">
        <h1 className="font-bold text-xl mb-3">Escenarios generados</h1>
        <div className="overflow-auto max-h-[400px]">
          <table className="w-full table-fixed border-collapse border border-gray-300">
            <thead>
              <tr>
                {columnas.map((col, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-300 px-2 py-1 text-sm font-semibold bg-gray-100"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {escenarios.map((escenario, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columnas.map((col, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 px-2 py-1 text-xs text-center"
                    >
                      {typeof escenario[col] === 'number'
                        ? escenario[col].toFixed(2)
                        : escenario[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-2 border rounded-lg shadow bg-white p-3 overflow-auto max-h-[600px]">
        <h1 className="font-bold text-xl mb-3">Análisis Gráfico (Histogramas)</h1>
        {chartsData.length > 0 ? (
          chartsData.map((chart, idx) => (
            <div key={idx} className="mb-6">
              <HighchartsReact
                highcharts={Highcharts}
                options={chart.options}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay datos para mostrar</p>
        )}
      </div>
    </section>
  );
}