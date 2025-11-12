import Footer from "@/views/Layouts/Footer";
import TopBar from "@/views/Layouts/TopBar";

export default function Home() {
  return (
    <div className="bg-[#ffffff] min-h-screen flex flex-col">
      <TopBar/>

      <section className="flex flex-col items-center text-center mt-16 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#14213d] mb-4">
          Analiza, Evalúa y Optimiza tus proyectos con Gallrisk
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          La herramienta inteligente para el análisis financiero y estadístico de tus proyectos.
        </p>
        <button className="px-6 py-3 bg-yellow-intense text-black font-bold rounded-lg text-lg hover:bg-yellow-500 transition">
          Comenzar ahora
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 mt-20 mb-16 max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10 text-yellow-intense" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-nigth-blue">Análisis Estadístico</h3>
          <p className="text-gray-600">Obtén métricas clave y descubre patrones en tus proyectos en segundos.</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10 text-yellow-intense" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-nigth-blue">Evaluación de Rentabilidad</h3>
          <p className="text-gray-600">Determina el retorno y la viabilidad de cada inversión con precisión.</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10 text-yellow-intense" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-nigth-blue">Velocidad de Análisis</h3>
          <p className="text-gray-600">Procesa grandes volúmenes de datos en pocos segundos sin complicaciones.</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10 text-yellow-intense" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-nigth-blue">Seguridad Garantizada</h3>
          <p className="text-gray-600">Protegemos tu información con encriptación avanzada y políticas seguras.</p>
        </div>
      </section>

      <Footer/>
    </div>
  );
};
