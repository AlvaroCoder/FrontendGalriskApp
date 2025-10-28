'use client';
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

// Colores base
const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA"
};

export default function ButtonExcelUploader({
    handleSubmitExcel = async () => {},
    loading = false,
    className = "",
    buttonText = "Subir archivo"
}) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;

        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
        
        if (validExtensions.includes(fileExtension)) {
            setFile(selectedFile);
            toast.success("Archivo seleccionado correctamente");
        } else {
            toast.error("Por favor selecciona un archivo Excel válido (.xlsx, .xls, .csv)");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const removeFile = () => {
        setFile(null);
        toast.info("Archivo removido");
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("No se ha seleccionado ningún archivo", {
                position: 'bottom-center'
            });
            return;
        }
        
        await handleSubmitExcel(file);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`w-full max-w-md mx-auto ${className}`}>
            {!file ? (
                <div
                    className={`
                        relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer
                        transition-all duration-300 ease-out group
                        ${isDragging 
                            ? 'border-accent bg-accent/5 scale-105' 
                            : 'border-gray-300 hover:border-accent hover:bg-white/50'
                        }
                    `}
                    style={{ borderColor: isDragging ? colors.accent : undefined }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        onChange={handleFileChange}
                        id="excel-upload"
                    />
                    <label htmlFor="excel-upload" className="cursor-pointer w-full text-center">
                        <div className={`
                            w-full h-20 rounded-2xl mb-4 flex items-center justify-center
                            transition-all duration-300 group-hover:scale-110
                            ${isDragging ? 'bg-accent/20' : 'bg-gradient-to-br from-green-50 to-blue-50'}
                        `}>
                            <Upload 
                                className={`
                                    w-8 h-8 transition-all duration-300
                                    ${isDragging ? 'text-accent scale-110' : 'text-gray-400 group-hover:text-accent'}
                                `}
                                style={{ color: isDragging ? colors.accent : undefined }}
                            />
                        </div>

                        <h3 className={`
                            font-semibold mb-2 transition-colors duration-300
                            ${isDragging ? 'text-accent' : 'text-gray-700'}
                        `} style={{ color: isDragging ? colors.accent : undefined }}>
                            {isDragging ? 'Suelta el archivo aquí' : 'Sube tu archivo Excel'}
                        </h3>
                        
                        <p className="text-sm text-gray-500 mb-3">
                            Arrastra o haz clic para seleccionar
                        </p>

                        <div className="text-xs text-gray-400 space-y-1">
                            <p>Formatos soportados: .xlsx, .xls, .csv</p>
                            <p>Tamaño máximo: 10MB</p>
                        </div>
                    </label>

                    <div className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 pointer-events-none
                        bg-gradient-to-r from-transparent via-accent/5 to-transparent
                    `} />
                </div>
            ) : (
                <div className="animate-slide-down">
                    <div className={`
                        bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200
                        rounded-2xl p-6 group hover:shadow-lg transition-all duration-300
                    `}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <FileSpreadsheet 
                                        className="w-6 h-6 text-green-600" 
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-1">
                                        {file.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center
                                    bg-white text-gray-400 hover:text-red-500 hover:bg-red-50
                                    transition-all duration-300 hover:scale-110
                                    shadow-sm
                                `}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                                className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: loading ? '60%' : '100%' }}
                            />
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            {loading ? 'Procesando archivo...' : 'Listo para subir'}
                        </p>
                    </div>
                </div>
            )}

            <button
                disabled={loading || !file}
                onClick={handleUpload}
                className={`
                    w-full mt-6 py-4 px-6 rounded-xl font-semibold
                    transition-all duration-300 flex items-center justify-center gap-3
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:shadow-lg active:scale-95
                    ${!file ? 'bg-gray-300 text-gray-500' : ''}
                `}
                style={{ 
                    backgroundColor: file ? colors.accent : undefined,
                    color: file ? colors.primary : undefined
                }}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Subiendo...</span>
                    </>
                ) : (
                    <>
                        <Upload className="w-5 h-5" />
                        <span>{buttonText}</span>
                    </>
                )}
            </button>

            {/* Información adicional */}
            {!file && (
                <div className="text-center mt-4">
                    <p className="text-xs text-gray-400">
                        Tus datos están seguros y protegidos
                    </p>
                </div>
            )}

            <style jsx global>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}