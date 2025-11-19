'use client';
import { getSession } from '@/authentication/lib';
import { deleteExcel, getExcelsByIdUser } from '@/lib/apiConnection'
import ListCardExcels from '@/views/Cards/ListCardExcels';
import WelcomeCard from '@/views/Cards/WelcomCard';
import LoadingPage from '@/views/Loading/LoadingPage';
import { Trash, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const ExcelIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#21A366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#21A366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="#21A366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="#21A366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="#21A366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


export default function Page() {
  const [loading, setLoading] = useState(true);
  const [excelsData, setExcelsData] = useState([]);
  const [dataUser, setdataUser] = useState(null)
  const router = useRouter();
  useEffect(()=>{
    async function getUserSession() {
      try {
        setLoading(true);
        const session = await getSession();
        console.log(session);
        
        const responseExcels = await getExcelsByIdUser(session?.id);
        const responseJSON = await responseExcels.json();
        
        setdataUser(session);
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

  const handleDeleteExcel=async(idExcel)=>{
    try {
      setLoading(true);
      await deleteExcel(idExcel);

      toast("Proyecto eliminado correctamente", {
        type : 'success',
        position : 'bottom-center'
      });

      window.location.reload();
      setExcelsData(prev => prev.filter(item => item.id !== idExcel));
    } catch (err) {
      console.error('Error eliminando Excel:', err);
      toast("Error al eliminar el Excel", {
        type: 'error',
        position: 'bottom-center'
      });
    } finally { 
      setLoading(false);
    }
  }

  if (loading){
    return <LoadingPage loading={loading} />;
  }

    return (
      <section className='w-full min-h-screen py-8 bg-white flex flex-col  items-center text-nigth-blue'>
        <WelcomeCard
          userData={dataUser}
        />
        <ListCardExcels
          handleDeleteExcel={handleDeleteExcel}
          excelsData={excelsData}
        />
    </section>
  )
};