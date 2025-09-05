"use client";
import { signUp } from '@/authentication/lib';
import StyleInputMaterialUi from '@/elements/StyleInputMaterialUi';
import { TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
    const URL_IMAGEN_LOGIN = "https://res.cloudinary.com/dabyqnijl/image/upload/v1757035964/Finance_app-cuate_khnbqo.png";
    const [dataUser, setDataUser] = useState({
        username : "",
        password : "",
        email : ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange=(e)=>{
        const target = e.target;
        setDataUser({
            ...dataUser,
            [target.name] : target.value
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const response = await signUp(dataUser);
            if (response.error) {
                toast("Datos ingresados incorrectamente",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
            }
            toast("Inicio de sesion exitoso",{
                type : 'success',
                position : 'bottom-right'
            });
            router.push("/dashboard");
        } catch (error) {
            toast("Error en el servidor",{
                type : 'error',
                position : 'bottom-center'
            });
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Sección izquierda (Formulario) */}
      <div className="flex flex-col justify-center px-8 md:px-16 bg-white">
        <h2 className="text-3xl font-bold text-[#14213d] mb-6">Crea tu cuenta en Galrisk</h2>
        <p className="text-gray-600 mb-8">
          Regístrate y empieza a analizar tus proyectos con herramientas avanzadas.
        </p>

        <form 
        onSubmit={handleSubmit}
        className="space-y-6">
            <div>
                <TextField
                    label="Nombre de usuario"
                    type='text'
                    name='username'
                    value={dataUser.username}
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </div>
            <div>
                <TextField
                    label="Correo electronico"
                    type='email'
                    name='email'
                    value={dataUser.email}
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </div>
            <StyleInputMaterialUi
                handleChange={handleChange}
                nameInput='password'
                value={dataUser.password}
            />
            <button
                type="submit"
                className="w-full bg-[#fca311] text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition"
            >
                {loading ? <Loader2 className="animate-spin"/> : <p>Registrarse</p>}
            </button>
        </form>

        {/* Enlace a inicio de sesión */}
        <p className="mt-6 text-gray-600 text-sm">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-[#fca311] font-semibold hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>

      {/* Sección derecha (Imagen + frase) */}
      <div className="hidden md:flex items-center justify-center bg-[#14213d] text-white relative">
        <Image
          src={URL_IMAGEN_LOGIN}
          width={400}
          height={600}
          alt="Finanzas"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6">
          <h3 className="text-4xl font-bold mb-4">
            “Cada decisión financiera inteligente comienza con la información correcta.”
          </h3>
          <p className="text-lg">
            Con Galrisk, tu análisis financiero es más seguro, rápido y preciso.
          </p>
        </div>
      </div>
    </div>
  )
};