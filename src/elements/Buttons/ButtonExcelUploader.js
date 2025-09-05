'use client';
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function ButtonExcelUploader({
    handleSubmitExcel=async()=>{},
    loading=false
}) {
    const [file, setFile] = useState(null);
    const handleFileChange=(e)=>{
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
            setFile(selectedFile)
        } else {
            toast("Selecciona un documento excel");
        }
    }
    const removeFile=()=>{
        setFile(null)
    }
    const handleUpload=async()=>{
        if (!file) {
            toast("No se ha seleccionado ningun archivo",{
                type :'error',
                position : 'bottom-center'
            });
            return;
        }
        await handleSubmitExcel(file);
    }
  return (
    <div className="max-w-3xl w-full mx-auto bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
        {
            !file ? (
                <label className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#fca311] transition">
                    <Upload className="text-[#fca311] w-10 h-10 mb-2" />
                    <p className="text-gray-500">Haz clic para subir tu archivo Excel</p>
                    <input
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                    />
              </label>
            ) : (
                <div className="w-full flex items-center justify-between bg-gray-100 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="text-green-600 w-6 h-6" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X />
                </button>
              </div>
            )
        }
        <button
            disabled={loading}
            onClick={handleUpload}
            className="mt-4 w-full bg-[#fca311] text-white py-2 rounded-xl hover:bg-[#e58e00] transition flex items-center justify-center gap-2"
            >
            {loading ? <Loader2 className='animate-spin'/> : <p className='flex flex-row gap-4 items-center'><Upload/> Subir archivo</p>}
        </button>
    </div>
  )
};