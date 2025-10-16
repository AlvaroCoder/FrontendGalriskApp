'use client'
import { getSession } from '@/authentication/lib';
import { Loader2, Upload, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function ButtonsGroup() {
  const router = useRouter();

  return(
    <div className="space-x-4">
      <button 
      onClick={()=>router.push("/login")}
      className="px-4 py-2 border border-white rounded hover:bg-white hover:text-nigth-blue transition">
          Iniciar sesión
      </button>
      <button 
      onClick={()=>router.push("/signup")}
      className="px-4 py-2 bg-[#fca311] text-black font-semibold rounded hover:bg-yellow-500 transition">
          Registrarse
      </button>
    </div>
  )
}

function ButtonUser({
  username
}) {
  const router = useRouter();
  return(
    <div className='flex flex-row gap-4'>
      <button 
      onClick={()=>router.push("/dashboard/upload")}
      className='flex flex-row gap-4 bg-yellow text-nigth-blue items-center bg-yellow-intense hover:bg-yellow-400 p-4 rounded-sm font-bold'>
        <Upload/> Subir tu proyecto
      </button>
      <button
        className="px-4 py-2 border border-white rounded hover:bg-blue-950  transition"
        onClick={()=>router.push("/dashboard/profile")}
      >
       <p className='flex flex-row gap-2'><User2/> <span>{username}</span></p>
      </button>
    </div>
  )
}

export default function TopBar() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  useEffect(()=>{
    async function getDataSession() {
      try {
        setLoading(true);
        const session = await getSession();        
        setUserData(session);
        
      } catch (error) {
        toast("No se pudo recolectar la sesion",{
          type : 'error',
          position : 'bottom-center'
        });
      } finally{
        setLoading(false);
      }

    } 
    getDataSession();
  },[]);
  return (
    <header className="bg-nigth-blue text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 
      onClick={()=>router.push("/dashboard")}
      className="text-2xl font-bold">Galrisk</h1>
      {
        loading ? 
        <span><Loader2 className='animate-spin' /></span> :
        (
          userData ? 
          <ButtonUser
            username={userData?.username}
          /> : 
          <ButtonsGroup/>
        )
      }
    </header>
  )
};
