"use client";
import ViewExcelVisor from "@/views/ViewExcelVisor";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function RenderApp() {
  const search = useSearchParams();
  const idExcel = search.get("idExcel");

  return (
    <main className="w-full min-h-screen p-6 bg-white text-nigth-blue">
        <ViewExcelVisor
          idExcel={idExcel}
        />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<p className="text-center mt-10 text-gray-600">Cargando ...</p>}
    >
      <RenderApp />
    </Suspense>
  );
}
