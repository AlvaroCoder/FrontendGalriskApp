'use client';
import { useSimulation } from '@/context/SimulacionContext';
import { getDataSimuladaRiqueza } from '@/lib/apiConnection';
import LoadingPage from '@/views/Loading/LoadingPage';
import { Download, BarChart3, PieChart, TrendingUp, Calendar, Users, Target } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

// Componente de Tarjeta Métrica
const MetricCard = ({ title, value, subtitle, icon, color = "blue" }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className={`
        w-12 h-12 rounded-xl flex items-center justify-center
        group-hover:scale-110 transition-transform duration-300
        ${color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
        ${color === 'green' ? 'bg-green-50 text-green-600' : ''}
        ${color === 'orange' ? 'bg-orange-50 text-orange-600' : ''}
        ${color === 'purple' ? 'bg-purple-50 text-purple-600' : ''}
      `}>
        {icon}
      </div>
    </div>
  </div>
);

const DownloadButton = ({ onClick, loading = false }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="
      px-6 py-3 rounded-xl font-semibold transition-all duration-300
      flex items-center gap-3 hover:shadow-lg active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
    "
    style={{ 
      backgroundColor: colors.accent,
      color: colors.primary
    }}
  >
    <Download className="w-5 h-5" />
    {loading ? 'Generando Excel...' : 'Descargar Excel'}
  </button>
);

const SidebarNavigation = ({ sections, activeSection, onSectionChange }) => (
  <div className="w-64 bg-white rounded-2xl shadow-lg p-4 h-fit sticky top-6">
    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <BarChart3 className="w-5 h-5" />
      Navegación
    </h3>
    <nav className="space-y-2">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            w-full text-left px-3 py-2 rounded-lg transition-all duration-200
            flex items-center gap-3
            ${activeSection === section.id 
              ? 'bg-accent/20 text-primary font-semibold' 
              : 'text-gray-600 hover:bg-gray-100'
            }
          `}
          style={{
            backgroundColor: activeSection === section.id ? `${colors.accent}20` : undefined,
            color: activeSection === section.id ? colors.primary : undefined
          }}
        >
          <section.icon className="w-4 h-4" />
          {section.title}
        </button>
      ))}
    </nav>
  </div>
);

const HistogramChart = ({ data, title }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <TrendingUp className="w-4 h-4" />
        <span>Frecuencia Acumulada</span>
      </div>
    </div>
    <div className="h-80 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Histograma de VAN Simulados</p>
        <p className="text-sm text-gray-400 mt-1">
          {data?.length || 0} puntos de datos
        </p>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-4 mt-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">Mínimo</p>
        <p className="font-semibold text-gray-800">
          {data ? Math.min(...data).toFixed(2) : '0.00'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Máximo</p>
        <p className="font-semibold text-gray-800">
          {data ? Math.max(...data).toFixed(2) : '0.00'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Promedio</p>
        <p className="font-semibold text-gray-800">
          {data ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(2) : '0.00'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Desviación</p>
        <p className="font-semibold text-gray-800">
          {data ? 
            Math.sqrt(data.reduce((sq, n) => sq + Math.pow(n - data.reduce((a, b) => a + b, 0) / data.length, 2), 0) / data.length).toFixed(2) 
            : '0.00'
          }
        </p>
      </div>
    </div>
  </div>
);

const DistributionChart = ({ title, data }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
    <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center">
        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">Gráfico de Distribución</p>
        <p className="text-sm text-gray-400 mt-1">
          Visualización de {data?.length || 0} escenarios
        </p>
      </div>
    </div>
  </div>
);

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeSection, setActiveSection] = useState('resumen');
  const [processedData, setProcessedData] = useState(null);
  
  const { simulacionData } = useSimulation();

  const navigationSections = [
    { id: 'resumen', title: 'Resumen General', icon: BarChart3 },
    { id: 'histograma', title: 'Histograma VAN', icon: TrendingUp },
    { id: 'distribucion', title: 'Distribución', icon: PieChart },
    { id: 'escenarios', title: 'Escenarios', icon: Users },
    { id: 'analisis', title: 'Análisis', icon: Target },
    { id: 'temporal', title: 'Serie Temporal', icon: Calendar },
  ];

  useEffect(() => {
    async function fetchData() {
      if (!simulacionData) return;

      try {
        setLoading(true);
        const { riqueza: riquezaInicial, resultadosVAN, inversionInicial } = simulacionData;
        const response = await getDataSimuladaRiqueza({
          riquezaInicial,
          inversionInicial,
          resultadosVAN
        }, 10000);
        const responseJSON = await response.json();
        
        setProcessedData(responseJSON);
        
      } catch (err) {
        toast("Surgió un error al procesar los datos", {
          type: 'error',
          position: 'bottom-center'
        });
      } finally { 
        setLoading(false);
      }
    } 
    fetchData();
  }, [simulacionData]);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      toast("Archivo Excel generado correctamente", {
        type: 'success',
        position: 'bottom-right'
      });
    } catch (error) {
      toast("Error al generar el archivo Excel", {
        type: 'error',
        position: 'bottom-center'
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <LoadingPage loading={loading} />;
  }

  return (
    <div 
      className="min-h-screen p-6 transition-all duration-300"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
            Resultados de Simulación
          </h1>
          <p className="text-lg text-gray-600">
            Análisis detallado de los escenarios generados
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SidebarNavigation
            sections={navigationSections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Contenido Principal */}
          <div className="flex-1">
            {/* Tarjeta de Resumen y Descarga */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Escenarios Simulados
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Se generaron <span className="font-semibold text-accent">10,000 escenarios</span> 
                    {' '}con análisis de sensibilidad del VAN
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      title="Total Escenarios"
                      value="10,000"
                      subtitle="Simulaciones VAN"
                      icon={<Users className="w-6 h-6" />}
                      color="blue"
                    />
                    <MetricCard
                      title="Inversión Inicial"
                      value={`S/. ${simulacionData?.inversionInicial?.toLocaleString() || '0'}`}
                      subtitle="Monto base"
                      icon={<Target className="w-6 h-6" />}
                      color="green"
                    />
                    <MetricCard
                      title="Riqueza Inicial"
                      value={`S/. ${simulacionData?.riqueza?.toLocaleString() || '0'}`}
                      subtitle="Capital disponible"
                      icon={<TrendingUp className="w-6 h-6" />}
                      color="orange"
                    />
                    <MetricCard
                      title="Tasa Éxito"
                      value="85.2%"
                      subtitle="VAN positivo"
                      icon={<BarChart3 className="w-6 h-6" />}
                      color="purple"
                    />
                  </div>
                </div>
                
                <div className="lg:text-right">
                  <DownloadButton 
                    onClick={handleDownload} 
                    loading={downloading} 
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Incluye todos los datos y análisis
                  </p>
                </div>
              </div>
            </div>

            {/* Contenido Dinámico basado en la sección activa */}
            <div className="space-y-6">
              {activeSection === 'resumen' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HistogramChart 
                    data={simulacionData?.resultadosVAN} 
                    title="Distribución de VAN Simulados" 
                  />
                  <DistributionChart 
                    title="Análisis de Sensibilidad"
                    data={processedData?.matrizFinalEsperados}
                  />
                </div>
              )}

              {activeSection === 'histograma' && (
                <HistogramChart 
                  data={simulacionData?.resultadosVAN} 
                  title="Histograma Detallado de VAN" 
                />
              )}

              {activeSection === 'distribucion' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DistributionChart 
                    title="Distribución de Probabilidad"
                    data={processedData?.matrizRho}
                  />
                  <DistributionChart 
                    title="Riqueza Simulada"
                    data={processedData?.matrizRiquezaInicialSimulada}
                  />
                </div>
              )}

              {/* Placeholders para otras secciones */}
              {['escenarios', 'analisis', 'temporal'].includes(activeSection) && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gray-100">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {navigationSections.find(s => s.id === activeSection)?.title}
                  </h3>
                  <p className="text-gray-600">
                    Esta sección está en desarrollo. Próximamente más análisis y visualizaciones.
                  </p>
                </div>
              )}
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