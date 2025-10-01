import { Loader2 } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

export default function LoadingPage({ message = "Cargando...", loading=false }) {
  if (loading) {
    return (
      <div 
        className="z-50 fixed inset-0 bg-black/50 flex justify-center items-center"
        role="status"
        aria-label="Página en proceso de carga"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-10 py-4 w-40 rounded-2xl bg-white shadow-lg flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 " />
          </motion.div>
          <h1 className="font-bold mt-4 text-gray-700 text-lg">Galrisk</h1>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </motion.div>
      </div>
    );
  }
  return null
}