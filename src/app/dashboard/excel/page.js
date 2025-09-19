'use client'
import ViewExcelVisor from '@/views/ViewExcelVisor';
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

function RenderApp() {
  const search = useSearchParams();
  const idExcel = search.get("idExcel");
  return(
    <main className=' w-full min-h-screen  p-6 bg-white text-nigth-blue'>
      <ViewExcelVisor
        idExcel={idExcel}
      />
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