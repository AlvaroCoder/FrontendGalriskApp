'use client'
import React from 'react'
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  PieChart, 
  Zap, 
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'


const features = [
  {
    icon: TrendingUp,
    title: "Extracción de Variables Top",
    description: "Identifica automáticamente las variables más críticas que impactan en tus resultados financieros.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: BarChart3,
    title: "Simulación de Escenarios",
    description: "Genera miles de escenarios posibles para evaluar diferentes condiciones del mercado.",
    gradient: "from-green-500 to-emerald-400"
  },
  {
    icon: Target,
    title: "Análisis de Sensibilidad",
    description: "Determina cómo los cambios en variables clave afectan el rendimiento de tu proyecto.",
    gradient: "from-purple-500 to-pink-400"
  },
  {
    icon: PieChart,
    title: "Análisis Monte Carlo",
    description: "Aplica métodos estadísticos avanzados para modelar la incertidumbre en tus proyecciones.",
    gradient: "from-orange-500 to-red-400"
  },
  {
    icon: Zap,
    title: "Análisis de Utilidad Esperada",
    description: "Evalúa decisiones bajo incertidumbre considerando tu perfil de aversión al riesgo.",
    gradient: "from-yellow-500 to-amber-400"
  },
  {
    icon: Shield,
    title: "Resultados Confiables",
    description: "Toma decisiones basadas en análisis estadísticos robustos y metodologías validadas.",
    gradient: "from-indigo-500 to-blue-400"
  }
]

export default function FeaturesAbout() {
    const router = useRouter();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-gray-50/30 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-intense/20 border border-yellow-intense/30 mb-6">
            <Sparkles className="w-4 h-4 text-nigth-blue" />
            <span className="text-sm font-semibold text-nigth-blue">
              Características Principales
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-nigth-blue mb-6">
            Potencia tu 
            <span className="bg-gradient-to-r from-yellow-intense to-orange-400 bg-clip-text text-transparent"> Análisis Financiero</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre todas las herramientas avanzadas que Gallrisk pone a tu disposición 
            para transformar datos complejos en decisiones estratégicas claras.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                group
                relative
                bg-white
                rounded-2xl
                p-6
                shadow-lg
                hover:shadow-2xl
                border
                border-gray-200/50
                hover:border-gray-300
                transition-all
                duration-300
                hover:scale-105
                overflow-hidden
              "
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
              
              <div className={`
                relative
                w-14
                h-14
                rounded-xl
                bg-gradient-to-br
                ${feature.gradient}
                flex
                items-center
                justify-center
                mb-4
                group-hover:scale-110
                transition-transform
                duration-300
              `}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-nigth-blue mb-3 group-hover:text-gray-800 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-nigth-blue transition-colors duration-300">
                <span>Más información</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>

              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-200/30 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-intense/10 to-orange-400/10 rounded-2xl p-8 border border-yellow-intense/20">
            <h3 className="text-2xl font-bold text-nigth-blue mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Únete a Gallrisk hoy mismo y descubre cómo nuestras herramientas pueden 
              transformar tu proceso de toma de decisiones financieras.
            </p>
            <button 
            onClick={()=>router.push("/dashboard")}
            className="
              relative
              bg-nigth-blue
              text-white
              px-8
              py-4
              rounded-xl
              font-bold
              transition-all
              duration-300
              hover:shadow-lg
              hover:scale-105
              active:scale-95
              flex
              items-center
              gap-3
              mx-auto
              group
              overflow-hidden
              cursor-pointer
            ">
              <div className=" absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
              
              <span>Comienza tu análisis</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-intense to-orange-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}