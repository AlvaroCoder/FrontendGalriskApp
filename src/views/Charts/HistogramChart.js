import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

const HistogramChart = ({ data, title, dataVanActual = 1023.05 }) => {
  const chartOptions = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length);

    const binCount = Math.ceil(Math.sqrt(data.length));
    const binWidth = (max - min) / binCount;
    
    const bins = Array.from({ length: binCount }, (_, i) => {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      const binMean = (binStart + binEnd) / 2; 
      const isNegative = binMean < 0; 
      
      return {
        start: binStart,
        end: binEnd,
        mean: binMean,
        count: data.filter(x => x >= binStart && x < binEnd).length,
        isNegative: isNegative
      };
    });

    let cumulative = 0;
    const cumulativeData = bins.map(bin => {
      cumulative += bin.count;
      return cumulative / data.length * 100; 
    });

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
      xAxis: [{
        title: {
          text: 'Valor VAN',
          style: {
            color: '#6B7280',
            fontSize: '12px'
          }
        },
        categories: bins.map(bin => bin.mean.toFixed(1)),
        labels: {
          style: {
            color: '#6B7280',
            fontSize: '11px'
          },
          rotation: -45, 
          formatter: function() {
            return this.value;
          }
        },
        crosshair: true,
        tickLength: 0
      }],
      yAxis: [{
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
      }, {
        title: {
          text: 'Frec. Acumulada (%)',
          style: {
            color: '#DC2626',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            color: '#6B7280',
            fontSize: '11px'
          },
          format: '{value}%'
        },
        opposite: true,
        min: 0,
        max: 100
      }],
      tooltip: {
        shared: true,
        formatter: function() {
          const binIndex = this.points[0].point.index;
          const bin = bins[binIndex];
          const freq = bin.count;
          const cumul = cumulativeData[binIndex];
          
          return `
            <b>Media del Bin:</b> ${bin.mean.toFixed(2)}<br/>
            <b>Rango:</b> ${bin.start.toFixed(2)} - ${bin.end.toFixed(2)}<br/>
            <b>Frecuencia:</b> ${freq} escenarios<br/>
            <b>Acumulado:</b> ${cumul.toFixed(1)}%
          `;
        }
      },
      plotOptions: {
        column: {
          borderWidth: 0,
          borderRadius: 2,
          pointPadding: 0,
          groupPadding: 0.1,
          colorByPoint: true, // Permitir colores diferentes por punto
          colors: bins.map(bin => 
            bin.isNegative 
              ? {
                  linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                  stops: [
                    [0, '#EF4444'], // Rojo para valores negativos
                    [1, '#DC2626']
                  ]
                }
              : {
                  linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                  stops: [
                    [0, '#FFC525'], // Naranja para valores positivos
                    [1, '#F59E0B']
                  ]
                }
          )
        },
        line: {
          marker: {
            enabled: false
          }
        }
      },
      series: [{
        name: 'Frecuencia',
        type: 'column',
        data: bins.map(bin => ({
          y: bin.count,
          color: bin.isNegative ? '#EF4444' : '#FFC525' // Color individual por barra
        })),
        yAxis: 0
      }, {
        name: 'Frecuencia Acumulada',
        type: 'spline',
        data: cumulativeData,
        color: '#1B263B', // Cambiado a color primary para mejor contraste
        dashStyle: 'ShortDash',
        marker: {
          enabled: false
        },
        yAxis: 1
      }, {
        name: 'Media General',
        type: 'line',
        data: [
          [0, 0],
          [bins.length - 1, Math.max(...bins.map(bin => bin.count)) * 1.1]
        ],
        color: '#10B981', 
        lineWidth: 2,
        dashStyle: 'Dash',
        marker: {
          enabled: false
        },
        enableMouseTracking: false,
        yAxis: 0
      }, {
        name: 'VAN Actual',
        type: 'line',
        data: [
          [bins.findIndex(bin => dataVanActual >= bin.start && dataVanActual < bin.end), 0],
          [bins.findIndex(bin => dataVanActual >= bin.start && dataVanActual < bin.end), Math.max(...bins.map(bin => bin.count)) * 1.1]
        ],
        color: '#8B5CF6', // Violeta para el VAN actual
        lineWidth: 2,
        dashStyle: 'Dash',
        marker: {
          enabled: false
        },
        enableMouseTracking: false,
        yAxis: 0
      }],
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal',
        itemStyle: {
          color: '#6B7280',
          fontSize: '11px'
        }
      }
    };
  }, [data, dataVanActual]);

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      return { min: 0, max: 0, mean: 0, stdDev: 0 };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length);

    return { min, max, mean, stdDev };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-nigth-blue">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Frecuencia Acumulada</span>
          </div>
        </div>
        <div className="h-80 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No hay datos disponibles</p>
            <p className="text-sm text-gray-400 mt-1">
              Cargando datos de simulación...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-nigth-blue">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Frecuencia Acumulada</span>
        </div>
      </div>
      
      <div className="h-96 rounded-xl bg-white">
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{ style: { height: '100%', width: '100%' } }}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Mínimo</p>
          <p className="font-semibold text-nigth-blue text-lg">
            {stats.min.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Máximo</p>
          <p className="font-semibold text-nigth-blue text-lg">
            {stats.max.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Promedio</p>
          <p className="font-semibold text-nigth-blue text-lg">
            {stats.mean.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Desviación</p>
          <p className="font-semibold text-nigth-blue text-lg">
            {stats.stdDev.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#FFC525]"></div>
            <span>VAN Positivo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-[#EF4444]"></div>
            <span>VAN Negativo</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 bg-[#1B263B] border border-dashed"></div>
            <span>Frec. Acumulada</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-[#10B981] border border-dashed"></div>
            <span>Media General</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-[#8B5CF6] border border-dotted"></div>
            <span>VAN Actual</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistogramChart;