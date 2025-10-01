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
    const [rhoData, setRhoData] = useState([]);
    const [rhoKeys, setRhoKeys] = useState([]);

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

            console.log(responseJSON);

            if (matrizFinalEsperados && matrizVANObtenida) {
                const formattedData = matrizFinalEsperados.map((valor, index) => ({
                    index: index + 1,
                    riqueza: valor,
                    van: matrizVANObtenida[index] ?? 0,
                }));
                setCharData(formattedData);
            }

            if (matrizRiquezaInicialSimulada && matrizRiquezaInicialSimulada.length > 0) {
                const formattedRiquezaInicial = matrizRiquezaInicialSimulada[0].map((valor, index) => ({
                    index: index + 1,
                    simulacion1: valor,
                    simulacion2: matrizRiquezaInicialSimulada[1]?.[index] ?? 0,
                }));
                setRiquezaInicialData(formattedRiquezaInicial);
            }

            // 🔹 Procesar matrizRho
            if (matrizRho && matrizRho.length > 0) {
                const coeficientesRho = [0.2, 0.4, 0.6, 0.8, 1.05, 1.1, 1.2, 1.4, 1.6, 1.8, 2.0];
                const formattedRhoData = matrizRho.map((fila, index) => {
                    const row = { index: index + 1 };
                    coeficientesRho.forEach((rho, j) => {
                        row[`rho_${rho}`] = fila[j];
                    });
                    return row;
                });
                setRhoData(formattedRhoData);
                setRhoKeys(coeficientesRho.map((r) => `rho_${r}`));
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
            <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue mb-4">
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

            {/* 🔹 Tercer gráfico: un gráfico por cada rho */}
            <section className="p-4 bg-white rounded-lg shadow border border-nigth-blue">
                <h2 className="text-lg font-semibold mb-4">Evolución por coeficiente Rho</h2>

                {rhoData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rhoKeys.map((rhoKey, i) => (
                            <div key={rhoKey} className="p-4 bg-gray-50 rounded-lg shadow">
                                <h3 className="text-md font-medium mb-2">{rhoKey.replace("rho_", "Rho ")}</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={rhoData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="index" label={{ value: 'Iteraciones', position: 'insideBottom', offset: -5 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey={rhoKey} stroke="#8884d8" dot={false} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No hay datos de rho para graficar.</p>
                )}
            </section>
        </main>
    );
}