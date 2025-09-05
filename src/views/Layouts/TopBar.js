'use client'
import { getSession } from '@/authentication/lib';
import { Loader2, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function ButtonsGroup() {
  return(
    <div className="space-x-4">
      <button 
      onClick={()=>router.push("/login")}
      className="px-4 py-2 border border-white rounded hover:bg-white hover:text-nigbg-nigth-blue transition">
          Iniciar sesión
      </button>
      <button className="px-4 py-2 bg-[#fca311] text-black font-semibold rounded hover:bg-yellow-500 transition">
          Registrarse
      </button>
    </div>
  )
}

function ButtonUser({
  username
}) {
  return(
    <div>
      <button
      className="px-4 py-2 border border-white rounded hover:bg-blue-950 hover:text-nigbg-nigth-blue transition"
      >
       <p className='flex flex-row gap-2'><User2/> <span>{username}</span></p>
      </button>
    </div>
  )
}

export default function TopBar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(()=>{
    async function getDataSession() {
      try {
        setLoading(true);
        const session = await getSession();
        const user = session.user;
        setUserData(user);
        
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
      <h1 className="text-2xl font-bold">Galrisk</h1>
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
