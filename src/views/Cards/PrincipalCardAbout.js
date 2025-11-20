import React from 'react'

export default function PrincipalCardAbout() {
  return (
      <div className='w-full min-h-screen bg-white relative overflow-hidden'>
                <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-intense/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-nigth-blue/10 rounded-full blur-3xl"></div>
          </div>
          <section className='w-full min-h-screen rounded-lg bg-gradient-to-br from-[#F5F6FA] via-white to-yellow-intense/30 flex flex-col justify-center items-center p-6 relative z-10'>
              <div className='max-w-6xl w-full text-center pt-20'>
                  <h1 className='text-5xl md:text-7xl font-extrabold text-nigth-blue leading-tight mb-6'>
                      Evalúa {" "}
                      <span className='bg-gradient-to-r from-yellow-intense to-orange-400 bg-clip-text text-transparent'>tu proyecto</span> {" "}
                      con nuestras herramientas
                  </h1>
              </div>
              <div className='max-w-2xl mx-auto'>
                  <p className='text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed text-center'>
                      Realiza un análisis de sensibilida de tu variable objetivo. Teniendo en cuenta su riqueza e inversion.
                  </p>
              </div>
        </section>
    </div>
  )
};