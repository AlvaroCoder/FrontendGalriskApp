import { useSimulation } from "@/context/SimulacionContext";
import { getDataSimuladaRiqueza } from "@/lib/apiConnection";
import React, { useEffect, useState } from "react";

export default function LineChartVan() {
  const [charData, setCharData] = useState(null);
  const [dataRhos, setDataRhos] = useState(null);

  const { simulacionData } = useSimulation();

  useEffect(() => {
    async function getDataSimulacionRiqueza() {
      try {
        const newDataToSend = {
          riquezaInicial: simulacionData?.riqueza,
          inversionInicial: simulacionData?.inversionInicial,
          resultadosVAN: simulacionData?.resultadosVAN,
        };

        const response = await getDataSimuladaRiqueza(newDataToSend, 10000);
        const responseJSON = await response.json();
        console.log(responseJSON);

        const { matrizRho } = responseJSON;
        setDataRhos(matrizRho);

      } catch (err) {
        console.log(err);
      }
    }
    getDataSimulacionRiqueza();
  }, [simulacionData]);
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-nigth-blue">Simulaciones Rhos</h3>
        <div>
          
        </div>
      </div>
    </div>
  );
}
