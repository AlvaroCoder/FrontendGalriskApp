import { getDataSimuladaRiqueza } from '@/lib/apiConnection';
import React, { useEffect, useState } from 'react'
import {
    ResponsiveContainer,
    ComposedChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from 'recharts';

export default function ViewCellValues({
    inversionInicial = 0,
    vanSimulados = []
}) {
    const [charData, setCharData] = useState([]);
    const [riquezaInicialData, setRiquezaInicialData] = useState([]);

    useEffect(() => {
        async function getDataSimuladosRiqueza() {
            const dataToSend = {
                riquezaInicial: 0,
                inversionInicial,
                resultadosVAN: vanSimulados
            };

            const response = await getDataSimuladaRiqueza(dataToSend, 10000);
            const responseJSON = await response.json();
            const {
                matrizFinalEsperados,
                matrizRho,
                matrizRiquezaInicialSimulada,
                matrizVANObtenida
            } = responseJSON;

            // ✅ Formato para el primer gráfico
            if (matrizFinalEsperados && matrizVANObtenida) {
                const formattedData = matrizFinalEsperados.map((valor, index) => ({
                    index: index + 1,
                    riqueza: valor,
                    van: matrizVANObtenida[index] ?? 0,
                }));

                setCharData(formattedData);
            }

            // ✅ Formato para el segundo gráfico (riqueza inicial simulada)
            if (matrizRiquezaInicialSimulada && matrizRiquezaInicialSimulada.length > 0) {
                // Asumimos que son dos arrays paralelos
                const formattedRiquezaInicial = matrizRiquezaInicialSimulada[0].map((valor, index) => ({
                    index: index + 1,
                    simulacion1: valor,
                    simulacion2: matrizRiquezaInicialSimulada[1]?.[index] ?? 0,
                }));

                setRiquezaInicialData(formattedRiquezaInicial);
            }
        }

        getDataSimuladosRiqueza();
    }, [inversionInicial, vanSimulados]);

    return (
        <main>
            {/* Primer gráfico */}
            <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue mb-4">
                <h2 className="text-lg font-semibold mb-4">Inicial Data</h2>

                {charData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={charData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="index" label={{ value: 'Simulaciones', position: 'insideBottom', offset: -5 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Line type="monotone" dataKey="riqueza" stroke="#fca311" name="Riqueza Final Esperada" />
                            <Line type="monotone" dataKey="van" stroke="#14213d" name="VAN Esperado" />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-600">No hay datos disponibles para graficar.</p>
                )}
            </section>

            {/* Segundo gráfico */}
            <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue">
                <h2 className="text-lg font-semibold mb-4">Riqueza Inicial Simulada</h2>

                {riquezaInicialData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={riquezaInicialData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="index" label={{ value: 'Iteraciones', position: 'insideBottom', offset: -5 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />

                            <Line type="monotone" dataKey="simulacion1" stroke="#ff6361" name="Simulación 1" />
                            <Line type="monotone" dataKey="simulacion2" stroke="#003f5c" name="Simulación 2" />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-600">No hay datos disponibles para graficar.</p>
                )}
            </section>
        </main>
    );
}