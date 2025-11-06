'use client';
import { getSession } from '@/authentication/lib';
import { deleteExcel, getExcelsByIdUser } from '@/lib/apiConnection'
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
      <div className='max-w-7xl w-full flex flex-col justify-center items-center'>
                <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-nigth-blue" >
            Mis Proyectos de Excel
          </h1>
          <p className="text-lg opacity-80 text-nigth-blue" >
            Gestiona y continúa trabajando en tus archivos
            </p>
            <button
              onClick={()=>router.push("/dashboard/upload")}
              className="
                      w-full 
                      py-3 
                      mb-6
                      mt-4
                      px-4 
                      rounded-xl 
                      font-semibold 
                      transition-all 
                      duration-300 
                      hover:shadow-lg 
                      hover:scale-105 
                      active:scale-95
                      flex 
                      items-center 
                      justify-center 
                      gap-2
                    "
                    style={{ 
                      backgroundColor: "#FFC525",
                      color: "#1B263B"
                    }}>
              <p className='flex flex-row gap-4'><Upload/> Subir proyecto</p>
            </button>
        </div>
        {
          excelsData?.length > 0 &&
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              excelsData?.map((item, key)=>(
                <div key={key} className='relative group'>
                  <div 
                    className='                   
                      relative 
                        bg-white 
                        rounded-2xl 
                        shadow-lg 
                        p-6 
                        border-l-4
                        hover:shadow-2xl 
                        hover:-translate-y-2 
                        transition-all 
                        duration-300 
                        ease-out
                        h-full
                        flex 
                        flex-col'
                    style={{ 
                      borderLeftColor: `hsl(${key * 60}, 70%, 50%)`,
                      animation: `float 6s ease-in-out ${key * 0.2}s infinite`
                    }}
                    key={key}>
                  <div 
                    onClick={()=>handleDeleteExcel(item?.id)}
                    className='                      
                      absolute 
                      -top-3 
                      -right-3 
                      w-10 
                      h-10 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      transition-all 
                      duration-300 
                      hover:scale-110 
                      hover:rotate-12
                      shadow-lg
                      z-10'
                    style={{ backgroundColor: '#EF4444' }}>
                  <Trash className="w-5 h-5 text-white" />
                </div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 border border-green-200">
                      <ExcelIcon />
                    </div>
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `#FFC525`,
                        color: "#1B263B"
                      }}
                    >
                      ID: {item.id}
                    </span>
                    </div>
                  <div className="flex-grow">
                    <h3 
                      className="text-xl font-bold mb-3 line-clamp-2"
                      style={{ color: "#1B263B" }}
                    >
                      {item.nombre_excel}
                    </h3>
                    
                    {item.descripcion && (
                      <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                        {item.descripcion}
                      </p>
                    )}

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {item.fecha_procesado ? new Date(item.fecha_procesado).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Fecha no disponible'}
                      </div>
                    </div>
                    </div>
                  <button
                    onClick={() => router.push(`/dashboard/excel/?idExcel=${item.id}`)}
                    className="
                      w-full 
                      py-3 
                      px-4 
                      rounded-xl 
                      font-semibold 
                      transition-all 
                      duration-300 
                      hover:shadow-lg 
                      hover:scale-105 
                      active:scale-95
                      flex 
                      items-center 
                      justify-center 
                      gap-2
                    "
                    style={{ 
                      backgroundColor: "#FFC525",
                      color: "#1B263B"
                    }}
                  >
                    Analizar Proyecto
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  </div>
                  <div 
                  className="
                    absolute 
                    inset-0 
                    rounded-2xl 
                    opacity-0 
                    group-hover:opacity-100 
                    transition-opacity 
                    duration-300 
                    pointer-events-none
                    bg-gradient-to-r 
                    from-transparent 
                    via-white/10 
                    to-transparent
                    -z-10
                  "
                />
              </div>))
            }
          </section>
        }
      </div>
    </section>
  )
};