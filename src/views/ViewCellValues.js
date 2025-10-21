'use client';
import React, { useEffect, useState, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { getDataSimuladaRiqueza } from '@/lib/apiConnection';
import LoadingPage from './Loading/LoadingPage';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const ComposedChart = dynamic(
  () => import('recharts').then((mod) => mod.ComposedChart),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import('recharts').then((mod) => mod.Legend),
  { ssr: false }
);
const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { ssr: false }
);

const RhoCharts = dynamic(() => import('@/views/elements/RhoCharts'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-6 text-gray-500">
      Cargando gráficos Rho...
    </div>
  ),
});

export default function ViewCellValues({
  riquezaInicial = 0,
  inversionInicial = 0,
  vanSimulados = [] }) {
  const [charData, setCharData] = useState([]);
  const [riquezaInicialData, setRiquezaInicialData] = useState([]);
  const [rhoData, setRhoData] = useState([]);
  const [rhoKeys, setRhoKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getDataSimuladosRiqueza() {
      try {
        setLoading(true);
        const dataToSend = {
          riquezaInicial: 0,
          inversionInicial,
          resultadosVAN: vanSimulados,
        };

        const response = await getDataSimuladaRiqueza(dataToSend, 10000);
        const responseJSON = await response.json();
        const {
          matrizFinalEsperados,
          matrizRho,
          matrizRiquezaInicialSimulada,
          matrizVANObtenida,
        } = responseJSON;

        if (matrizFinalEsperados && matrizVANObtenida) {
          setCharData(
            matrizFinalEsperados.map((valor, index) => ({
              index: index + 1,
              riqueza: valor,
              van: matrizVANObtenida[index] ?? 0,
            }))
          );
        }

        if (matrizRiquezaInicialSimulada?.length > 0) {
          setRiquezaInicialData(
            matrizRiquezaInicialSimulada[0].map((valor, index) => ({
              index: index + 1,
              simulacion1: valor,
              simulacion2: matrizRiquezaInicialSimulada[1]?.[index] ?? 0,
            }))
          );
        }

        if (matrizRho?.length > 0) {
          const coeficientesRho = [0.2, 0.4, 0.6, 0.8, 1.05, 1.1, 1.2, 1.4, 1.6, 1.8, 2.0];
          const dataRhoFinal = coeficientesRho.map((_, keyRho) =>
            matrizRiquezaInicialSimulada[2]?.map((riqueza, idx) => ({
              riquezaFinal: riqueza,
              rho: matrizRho[idx][keyRho],
            }))
          );
          setRhoData(dataRhoFinal);
          setRhoKeys(coeficientesRho.map((r) => `rho_${r}`));
        }
      } catch (err) {
        console.error(err);
        toast('Ocurrió un error al obtener los datos', {
          type: 'error',
          position: 'bottom-center',
        });
      } finally {
        setLoading(false);
      }
    }

    getDataSimuladosRiqueza();
  }, [riquezaInicial, inversionInicial, vanSimulados]);

  const mainChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={charData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" label={{ value: 'Simulaciones', position: 'insideBottom', offset: -5 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="riqueza" stroke="#fca311" name="Riqueza Final Esperada" dot={false} />
        <Line type="monotone" dataKey="van" stroke="#14213d" name="VAN Esperado" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  ), [charData]);

  const riquezaChart = useMemo(() => (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={riquezaInicialData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" label={{ value: 'Iteraciones', position: 'insideBottom', offset: -5 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="simulacion1" stroke="#ff6361" name="VAN Final" dot={false} />
        <Line type="monotone" dataKey="simulacion2" stroke="#003f5c" name="VAB Bruto" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  ), [riquezaInicialData]);

  return (
    <main>
      <LoadingPage loading={loading} />

      <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue mb-4">
        <h2 className="text-lg font-semibold mb-4">Inicial Data</h2>
        {charData.length > 0 ? mainChart : <p className="text-gray-600">No hay datos disponibles.</p>}
      </section>

      <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue mb-4">
        <h2 className="text-lg font-semibold mb-4">Riqueza Inicial Simulada</h2>
        {riquezaInicialData.length > 0 ? riquezaChart : <p className="text-gray-600">No hay datos disponibles.</p>}
      </section>

      <Suspense
        fallback={
          <div className="p-4 flex justify-center items-center h-[400px] text-gray-600">
            Cargando gráficos Rho...
          </div>
        }
      >
        <RhoCharts rhoData={rhoData} rhoKeys={rhoKeys} />
      </Suspense>
    </main>
  );
}