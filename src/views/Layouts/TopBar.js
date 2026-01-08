'use client'
import { getSession } from '@/authentication/lib';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ButtonUser from "../../elements/Buttons/ButtonUser";

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
      className="text-2xl font-bold cursor-pointer">G@llrisk</h1>
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
