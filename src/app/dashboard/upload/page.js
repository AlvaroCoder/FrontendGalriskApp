'use client';
import { getSession } from '@/authentication/lib';
import ButtonExcelUploader from '@/elements/Buttons/ButtonExcelUploader';
import { uploadDocumentExcel } from '@/lib/apiConnection';
import ViewEscenarios from '@/views/ViewEscenarios';
import ViewExcelVisor from '@/views/ViewExcelVisor';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
    const [dataSession, setDataSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [excelResponse, setExcelResponse] = useState(null);
    const [escenarios, setEscenarios] = useState(null);
    
    useEffect(()=>{
        async function getUserSession() {
            try {
                setLoading(true);
                const session = await getSession();
                setDataSession(session);

            } catch (error) {
                toast("Ocurrio un error",{
                    type : 'error',
                    position : 'bottom-center'
                });
            } finally {
                setLoading(false);
            }
        }
        getUserSession();
    },[]);

      const handleSubmitExcel=async(fileExcel)=>{
        const newFormData = new FormData();
        newFormData.append("file", fileExcel);
        newFormData.append("usuario_id", dataSession?.id);
        const response = await uploadDocumentExcel(newFormData);
        
        if (!response.ok || response.status == 404) {
          toast("No se pudo subir el Excel!",{
            type : 'error',
            position : 'bottom-center'
          });
          return;
        }
    
        const responseJSON = await response.json();
        console.log(responseJSON?.excel?.id);
        
        setExcelResponse(responseJSON?.excel);
    
        toast("Excel guardado correctamente!",{
          type : 'success',
          position : 'bottom-right'
        });
      }
  return (
    <section className='w-full min-h-screen py-8 bg-white flex justify-center items-center text-nigth-blue'>
      {
        !escenarios ?
        (excelResponse ?
        <div className='max-w-4xl min-h-[400px] w-full'>
          <ViewExcelVisor
            idExcel={excelResponse && excelResponse?.id}
            handleSetEscenarios={setEscenarios}
          />
        </div> :
        <div className='max-w-4xl min-h-[400px] w-full rounded-lg p-4 flex flex-col items-center'>
          <h1 className='font-bold text-2xl'>Sube tu Proyecto !</h1>
          <ButtonExcelUploader
            loading={loading}
            handleSubmitExcel={handleSubmitExcel}
          />  
        </div>) : 
        <ViewEscenarios
          escenarios={escenarios}
        />
      }
    </section>
  )
};
