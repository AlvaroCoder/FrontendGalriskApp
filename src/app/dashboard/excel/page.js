'use client'
import ViewCellValues from '@/views/ViewCellValues';
import ViewEscenarios from '@/views/ViewEscenarios';
import ViewExcelVisor from '@/views/ViewExcelVisor';
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

function RenderApp() {
  const search = useSearchParams();
  const [escenarios, setEscenarios] = useState(null);
  const [inversionInicial, setInversionInicial] = useState(0);
  const [vanSimulados, setVanSimulados] = useState(0);

  const idExcel = search.get("idExcel");
  return(
    <main className=' w-full min-h-screen  p-6 bg-white text-nigth-blue'>
      {
        !escenarios ? 
        <ViewExcelVisor
          idExcel={idExcel}
          handleSetEscenarios={(escen, vans, invInicial)=>{
            setEscenarios(escen);
            setVanSimulados(vans)
            setInversionInicial(invInicial);
          }}
        /> : 
        <div>
            <ViewEscenarios
              escenarios={escenarios}
            />
            <ViewCellValues
              inversionInicial={inversionInicial}
              vanSimulados={vanSimulados}
            />
        </div>
      }
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={()=><p>Cargando ...</p>}>
      <RenderApp/>
    </Suspense>
  )
};