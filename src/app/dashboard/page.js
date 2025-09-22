'use client';
import { getSession } from '@/authentication/lib';
import { getExcelsByIdUser } from '@/lib/apiConnection'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [excelsData, setExcelsData] = useState([]);
  const router = useRouter();

  useEffect(()=>{
    async function getUserSession() {
      try {
        setLoading(true);
        const session = await getSession();        
        const responseExcels = await getExcelsByIdUser(session?.id);
        const responseJSON = await responseExcels.json();
        
        setExcelsData(responseJSON);

      } catch (error) {
        toast("No se pudo obtener la sesion del usuario",{
          type : 'error',
          position : 'bottom-center'
        });
      } finally{
        setLoading(false);
      }
    }
    getUserSession();
  },[]);


  return (
    <section className='w-full min-h-screen py-8 bg-white flex flex-col  items-center text-nigth-blue'>

      <div className='max-w-4xl w-full flex flex-col justify-center items-center'>
        <h1 className='text-3xl font-bold'>Proyectos Iniciados</h1>
        {
          excelsData?.length > 0 &&
          <section className='w-full grid gap-4 grid-cols-3 mt-4'>
            {
              excelsData?.map((item, key)=>(
              <div 
              
              className='flex flex-col items-center p-4 rounded-sm bg-white shadow'
              key={key}>
                <div>
                  <p>Proyecto</p>
                  <p>ID: {item?.id}</p>
                  <p>Nombre : {item?.nombre_excel}</p>
                </div>
                <button 
                onClick={()=> router.push(`/dashboard/excel/?idExcel=${item?.id}`)}
                className='p-2 rounded-sm mt-4 bg-yellow-intense w-full text-white'>Continuar Proyecto</button>
              </div>))
            }
          </section>
        }
      </div>
    </section>
  )
};