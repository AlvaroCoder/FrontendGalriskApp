'use client'

import ViewCellValues from '@/views/ViewCellValues';
import ViewEscenarios from '@/views/ViewEscenarios';
import ViewExcelVisor from '@/views/ViewExcelVisor';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';

function RenderApp() {
  const search = useSearchParams();
  const [escenarios, setEscenarios] = useState(null);
  const [inversionInicial, setInversionInicial] = useState(0);
  const [vanSimulados, setVanSimulados] = useState(0);

  const idExcel = search.get('idExcel');

  const handleSetEscenarios = (escen, vans, invInicial) => {
    setEscenarios(escen);
    setVanSimulados(vans);
    setInversionInicial(invInicial);
  };

  return (
    <main className="w-full min-h-screen p-6 bg-white text-nigth-blue">
      {!escenarios ? (
        <ViewExcelVisor idExcel={idExcel} handleSetEscenarios={handleSetEscenarios} />
      ) : (
        <div className="space-y-6">
          <ViewEscenarios escenarios={escenarios} />
          <ViewCellValues inversionInicial={inversionInicial} vanSimulados={vanSimulados} />
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10 text-gray-600">Cargando ...</p>}>
      <RenderApp />
    </Suspense>
  );
}