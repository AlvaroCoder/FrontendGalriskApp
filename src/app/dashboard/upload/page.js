"use client";
import { getSession } from "@/authentication/lib";
import ButtonExcelUploader from "@/elements/Buttons/ButtonExcelUploader";
import { updateDataExcel, uploadDocumentExcel } from "@/lib/apiConnection";
import { ArrowBack } from "@mui/icons-material";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();

  const [dataSession, setDataSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileExcel, setFileExcel] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre_excel: "",
    descripcion: "",
  });

  useEffect(() => {
    async function getUserSession() {
      try {
        setLoading(true);
        const session = await getSession();
        setDataSession(session);
      } catch (error) {
        toast("Ocurrio un error", {
          type: "error",
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    }
    getUserSession();
  }, []);

  const handleFileSelect = (file) => {
    setShowForm(true);
    setFileExcel(file);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmitExcel = async () => {
    if (fileExcel === null) {
      return toast("Por favor selecciona un archivo Excel", {
        type: "error",
        position: "bottom-center",
      });
    }

    try {
      setUploading(true);

      const newFormData = new FormData();
      newFormData.append("file", fileExcel);
      newFormData.append("usuario_id", dataSession?.id);
      newFormData.append(
        "nombre_excel",
        formData.nombre_excel || fileExcel.name
      );
      newFormData.append("descripcion", formData.descripcion || "");

      console.log("Enviando FormData:", {
        file: fileExcel.name,
        usuario_id: dataSession?.id,
        nombre_excel: formData.nombre_excel,
        descripcion: formData.descripcion,
      });

      const response = await uploadDocumentExcel(newFormData);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast(
          "No se pudo subir el Excel: " +
            (errorData.error || "Error desconocido"),
          {
            type: "error",
            position: "bottom-center",
          }
        );
        return;
      }

      const responseJSON = await response.json();
      
      const dataToSend = {
        id: responseJSON?.excel?.id,
        nombre_excel: formData?.nombre_excel,
        descripcion: formData?.descripcion
      };

      console.log(dataToSend);
      
      const responseUpdate = await updateDataExcel(dataToSend);
      console.log(await responseUpdate.json());
      
      router.push("/dashboard");

      toast("Excel guardado correctamente!", {
        type: "success",
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error en handleSubmitExcel:", error);
      toast("Error de conexión al subir el archivo", {
        type: "error",
        position: "bottom-center",
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <section className="w-full min-h-screen py-8 flex justify-center items-center text-nigth-blue transition-all duration-500">
      <div className="max-w-2xl w-full mx-4">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="font-bold text-4xl mb-4" style={{ color: "#1B263B" }}>
            Analiza tu proyecto
          </h1>
          <p className="text-lg opacity-80" style={{ color: "#1B263B" }}>
            Sube tu archivo y configura tu proyecto
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 animate-float">
          {!showForm ? (
            <div className="text-center p-8 border-gray-300 rounded-xl hover:border-accent transition-all duration-300 group">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 border border-green-200 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-10 h-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="#21A366"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="#21A366"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#1B263B" }}
                >
                  Selecciona tu archivo Excel
                </h3>
                <p className="text-gray-600 text-sm">
                  Formatos soportados: .xlsx, .xls, .csv
                </p>
              </div>

              <ButtonExcelUploader
                loading={loading}
                handleSubmitExcel={handleFileSelect}
                className="mx-auto"
              />
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 border border-green-200">
                  <svg
                    className="w-8 h-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="#21A366"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      stroke="#21A366"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: "#1B263B" }}
                >
                  Configura tu proyecto
                </h3>
                <p className="text-gray-600">
                  Completa los detalles de tu proyecto Excel
                </p>
              </div>

              <form className="space-y-6">
                <div className="group">
                  <label
                    htmlFor="nombre_excel"
                    className="block text-sm font-medium mb-2 transition-all duration-300 group-focus-within:font-semibold"
                    style={{ color: "#1B263B" }}
                  >
                    Nombre del Proyecto *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="nombre_excel"
                      name="nombre_excel"
                      value={formData.nombre_excel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 outline-none bg-white hover:border-gray-400"
                      placeholder="Ej: Reporte Financiero 2024"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-accent/30 pointer-events-none transition-all duration-300" />
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="descripcion"
                    className="block text-sm font-medium mb-2 transition-all duration-300 group-focus-within:font-semibold"
                    style={{ color: "#1B263B" }}
                  >
                    Descripción
                  </label>
                  <div className="relative">
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 outline-none bg-white hover:border-gray-400 resize-none"
                      placeholder="Describe el propósito de este proyecto..."
                    />
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-accent/30 pointer-events-none transition-all duration-300" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 px-6 rounded-xl bg-gray-200 text-nigth-blue font-semibold border-2 border-gray-300  hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    <ArrowBack /> Volver
                  </button>
                  <button
                    onClick={handleSubmitExcel}
                    type="button"
                    className="text-nigth-blue bg-orange-300 p-2 rounded-lg hover:bg-yellow-intense transition-all duration-300 px-4"
                  >
                    <p className="flex flex-row items-center gap-4">
                      <Save /> Guardar Proyecto
                    </p>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-sm text-gray-500">
            Tus archivos se procesan de forma segura y están disponibles solo
            para ti
          </p>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </section>
  );
}
