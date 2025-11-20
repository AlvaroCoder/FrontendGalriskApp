'use client'
import { useSimulation } from '@/context/SimulacionContext'
import SideBarNavigation from '@/views/Navigation/SideBarNavigation'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function RootLayout({ children }) {
    const { simulacionData } = useSimulation();
    const router = useRouter();

    useEffect(() => {
        if (!simulacionData) {
            console.log(simulacionData);
            
            router.push("/dashboard")
        }
    }, [simulacionData, router]);
  return (
      <div className='flex flex-row min-h-screen w-full'>
          <SideBarNavigation/>
          {children}
    </div>
  )
};