import { getDataSimuladaRiqueza } from '@/lib/apiConnection';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
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
import LoadingPage from './Loading/LoadingPage';

export default function ViewCellValues({
    inversionInicial = 0,
    vanSimulados = []
}) {
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
                
                
                if (matrizRho && matrizRho.length > 0) {
                    const coeficientesRho = [0.2, 0.4, 0.6, 0.8, 1.05, 1.1, 1.2, 1.4, 1.6, 1.8, 2.0];
                    const dataRhoFinal = coeficientesRho.map((_, keyRho)=>{
                        return matrizRiquezaInicialSimulada[2]?.map((riqueza, idx)=>({
                            riquezaFinal : riqueza,
                            rho : matrizRho[idx][keyRho]
                        }));
                    });
                    console.log(dataRhoFinal);
                    
                    setRhoData(dataRhoFinal);
                    setRhoKeys(coeficientesRho.map((item)=>`rho_${item}`));
                }
            } catch (err) {
                console.log(err);
                toast("Sucedio un errror ",{
                    type : 'error',
                    position:'bottom-center'
                })
            } finally{
                setLoading(false);
            }
        }

        getDataSimuladosRiqueza();
    }, [inversionInicial, vanSimulados]);

    return (
        <main>
        <LoadingPage loading={loading} />
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

            <section className='p-4 bg-white rounded-lg shadow border border-nigth-blue mb-4'>
                <h2 className="text-lg font-semibold mb-4">Coeficientes Rho vs Riqueza Inicial</h2>
                {
                    rhoData?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {rhoKeys?.map((rho, key)=>(
                                <div key={key} className="p-4 bg-gray-50 rounded-lg shadow">
                                    <h3  className="text-md font-semibold mb-2">Grafica de {rho}</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <ComposedChart data={rhoData[key]} >
                                        <XAxis
                                            dataKey="riquezaFinal"
                                            label={{ value: 'Riqueza Final', position: 'insideBottom', offset: -5 }}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="rho"
                                            stroke="#14213d"
                                            dot={false}
                                            name={`rho_${rho}`}
                                        />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No hay datos de rho para graficar.</p>
                    )
                }
            </section>
        </main>
    );
}
