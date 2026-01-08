'use client';
import { TextField } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import StyleInputMaterialUi from '@/elements/StyleInputMaterialUi';
import { login } from '@/authentication/lib';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Page() {
  const URL_IMAGEN_LOGIN = "https://res.cloudinary.com/dabyqnijl/image/upload/v1757035964/Finance_app-cuate_khnbqo.png";
  const router = useRouter(); 
  const [dataUser, setDataUser] = useState({
    username : "",
    password : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange=(e)=>{
    e.preventDefault();
    const target = e.target;
    setDataUser({
      ...dataUser,
      [target.name] : target.value
    });
  }
  const handleSubmit=async(evt)=>{
    evt.preventDefault();
    try {
      setLoading(true);
      const response = await login(dataUser);
      if (response.error) {
        setError(response.message);
        toast("Error iniciar sesion", {
          type : 'error',
          position : 'bottom-center'
        });
        return;
      }
      toast("Inicio de sesion exitoso",{
        type : 'success',
        position : 'bottom-right'
      });
      router.push("/dashboard")
    } catch (error) {
      toast("Ocurrio un error con el servidor",{
        type : 'error',
        position : 'bottom-center'
      });
    } finally{
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 text-nigth-blue">
      <div className="flex flex-col justify-center px-8 md:px-16 bg-white">
        {error && <div className='w-full bg-red-200 rounded-sm p-4 my-4'>
          <p>Error : {error?.error}</p>
        </div>}
        <h2 className="text-3xl font-bold text-[#14213d] mb-6">Inicia sesión en G@llrisk</h2>
        <p className="text-gray-600 mb-8">Accede a tu cuenta y analiza tus proyectos de manera segura.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <TextField
              label="Nombre de Usuario"
              type='text'
              name='username'
              value={dataUser.username}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>

          <StyleInputMaterialUi
            handleChange={handleChange}
            value={dataUser.password}
            nameInput="password"
          />

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#fca311] text-black font-semibold py-3 flex justify-center rounded-lg hover:bg-yellow-500 transition"
          >
            {loading ? <Loader2 className="animate-spin" /> : <p>Iniciar Sesion</p>}
          </button>
        </form>

        <p className="mt-6 text-gray-600 text-sm">
          ¿No tienes una cuenta?{" "}
          <Link 
            href="/signup" 
            className="text-[#fca311] font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>

      <div className="hidden md:flex items-center justify-center bg-[#14213d] text-white relative">
        <Image
          src={URL_IMAGEN_LOGIN} 
          width={400}
          height={500}
          alt="Finanzas"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-6">
          <h3 className="text-4xl font-bold mb-4">“Las finanzas inteligentes son la clave del éxito.”</h3>
          <p className="text-lg">Analiza, evalúa y toma mejores decisiones con Galrisk.</p>
        </div>
      </div>
    </div>
  )
};
