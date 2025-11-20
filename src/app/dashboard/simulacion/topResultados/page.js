import { useSimulation } from '@/context/SimulacionContext'
import React from 'react'

export default function Page() {
    const { simulacionData } = useSimulation();
    console.log(simulacionData);
    
  return (
    <div>page</div>
  )
}