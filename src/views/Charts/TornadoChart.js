import React from 'react'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function TornadoChart() {
      const chartOptions = {
    chart: {
      type: 'bar',
      inverted: true
    },
    title: {
      text: 'Gráfico Ciclón del Impacto en NPV'
    },
    xAxis: {
      categories: ['CVaR'],
      title: {
        text: null
      }
    },
    yAxis: {
      min: 0,
      max: 12000,
      title: {
        text: 'NPV',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true,
          format: '{point.y:,.0f}'
        },
        groupPadding: 0.1
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
      shadow: true
    },
    credits: {
      enabled: false
    },
    series: [{
      name: 'NPV Mínimo',
      data: [3040],
      color: '#FF6B6B'
    }, {
      name: 'NPV Máximo', 
      data: [10400],
      color: '#4ECDC4'
    }]
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};