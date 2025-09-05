'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function TopBar() {
  const router = useRouter();

  return (
        <header className="bg-[#14213d] text-white px-6 py-4 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Galrisk</h1>
            <div className="space-x-4">
            <button 
            onClick={()=>router.push("/login")}
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-[#14213d] transition">
                Iniciar sesión
            </button>
            <button className="px-4 py-2 bg-[#fca311] text-black font-semibold rounded hover:bg-yellow-500 transition">
                Registrarse
            </button>
            </div>
    </header>
  )
};
