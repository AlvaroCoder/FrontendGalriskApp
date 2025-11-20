'use client';
import { ChevronRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const URL_IMAGEN = 'https://res.cloudinary.com/dabyqnijl/image/upload/v1763614770/Screenshot_2025-11-19_at_23.56.56_bpsgpa.png';

export default function PrincipalCardHome() {
    const router = useRouter();
  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-intense/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-nigth-blue/10 rounded-full blur-3xl"></div>
      </div>

      <section className="w-full min-h-screen rounded-lg bg-gradient-to-br from-[#F5F6FA] via-white to-yellow-intense/30 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="max-w-6xl w-full text-center pt-20">
          <div className="mt-10 inline-flex items-center gap-2 px-4 py-2  rounded-full bg-yellow-intense/20 border border-yellow-intense/30 mb-8">
            <Sparkles className="w-4 h-4 text-nigth-blue" />
            <span className="text-sm font-semibold text-nigth-blue">
              Plataforma de Análisis Financiero
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-nigth-blue leading-tight mb-6">
            Analiza, Evalúa y{" "}
            <span className="bg-gradient-to-r from-yellow-intense to-orange-400 bg-clip-text text-transparent">
              Optimiza
            </span>{" "}
            tus proyectos
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              La herramienta inteligente para el análisis financiero y estadístico de tus proyectos. 
              Toma decisiones basadas en datos.
            </p>
          </div>

          {/* Características destacadas */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: TrendingUp, text: "Análisis en Tiempo Real" },
              { icon: Shield, text: "Resultados Confiables" },
              { icon: Zap, text: "Procesamiento Rápido" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200">
                <item.icon className="w-4 h-4 text-yellow-intense" />
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

        <button
            onClick={()=>router.push("/dashboard")}              
            className="
            group
            relative
            px-8 
            py-4 
            rounded-2xl 
            bg-nigth-blue 
            text-white 
            font-bold 
            text-lg
            transition-all 
            duration-300 
            hover:scale-105 
            hover:shadow-2xl
            active:scale-95
            flex 
            items-center 
            gap-3 
            mx-auto
            mb-12
            overflow-hidden
            cursor-pointer
          ">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl" />
            
            <span>Empieza ahora</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-intense to-orange-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
            </div>
          </button>

          <div className="relative w-full flex justify-center ">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-intense/20 to-nigth-blue/10 rounded-3xl blur-xl opacity-50"></div>
            <div className="w-fit relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50">
              <Image
                height={700}
                width={600}
                src={URL_IMAGEN}
                alt="Dashboard de Gallrisk - Análisis de proyectos"
                className="rounded-xl shadow-lg mx-auto transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </div>

          <div className="mt-12">
            <p className="text-gray-600 text-sm">
              Únete a cientos de profesionales que ya confían en Gallrisk
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}