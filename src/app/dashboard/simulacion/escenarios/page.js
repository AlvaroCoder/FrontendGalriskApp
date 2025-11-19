'use client'
import { useSimulation } from '@/context/SimulacionContext';
import ViewTableEscenario from '@/views/Tables/ViewTableEscenario';
import React from 'react'

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function Page() {
    const { simulacionData } = useSimulation();

  return (
      <div
          className='w-full min-h-screen p-6 transition-all duration-300'
          style={{ backgroundColor: colors.background }}
      >
        <div className='max-w-7xl mx-auto'>
              <div className='text-center mb-8 animate-slide-down'>
                  <h1
                      className='text-4xl font-bold mb-2'
                      style={{color : colors.primary}}
                  >
                      Resultados de los escenarios
                  </h1>
                  <p className='text-lg text-gray-600'>
                      Tabla de simulaciones de las variables simuladas
                  </p>
            </div>
          </div>
          <div className='flex flex-col lg:flex-row gap-6'>
              <div className='flex-1'>
                  <ViewTableEscenario
                    escenarios={simulacionData?.escenarios}
                  />
              </div>
          </div>
    </div>
  )
};