import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PercentIcon, AlertTriangle, X } from "lucide-react";
import React, { useState, useEffect } from "react";

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};

export default function DialogAdditionalDetails({
  open = false,
  handleSubmit = () => {},
  handleChangeOpen = () => {},
}) {
  const [data, setData] = useState({
    riqueza: "",
    tasa: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasData = data.riqueza.trim() !== "" || data.tasa.trim() !== "";
    setHasChanges(hasData);
  }, [data]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirm(true);
    } else {
      handleChangeOpen();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    setData({ riqueza: "", tasa: "" });
    handleChangeOpen();
  };

  const handleCancelClose = () => {
    setShowConfirm(false);
  };

  const handleSubmitForm = () => {
    if (data.riqueza && data.tasa) {
      handleSubmit(data);
      setData({ riqueza: "", tasa: "" });
      setHasChanges(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && hasChanges) {
      setShowConfirm(true);
    } else if (e.target === e.currentTarget) {
      handleChangeOpen();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          showCloseButton={false}
          className="
                        sm:max-w-md 
                        bg-white 
                        rounded-2xl 
                        shadow-2xl 
                        border-0 
                        p-0 
                        overflow-hidden
                        animate-dialog-in
                    "
          onClick={handleBackdropClick}
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${colors.accent}20` }}
                >
                  <PercentIcon
                    className="w-5 h-5"
                    style={{ color: colors.accent }}
                  />
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    Configuración Final
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Completa los datos para la simulación
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600  hover:bg-gray-100 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="space-y-3 group">
              <label
                htmlFor="riqueza"
                className="block text-sm font-medium transition-all duration-300 group-focus-within:font-semibold"
                style={{ color: colors.primary }}
              >
                Riqueza Inicial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">S/</span>
                </div>
                <Input
                  variant="ghost"
                  name="riqueza"
                  type="number"
                  onChange={handleChange}
                  value={data.riqueza}
                  className="pl-10 pr-4 py-3  border-2 border-gray-300 rounded-xl 
                                        focus:border-accent 
                                        focus:ring-2 focus:ring-accent/20 
                                        transition-all duration-300
                                        hover:border-gray-400
                                        bg-white
                                    "
                  placeholder="0.00"
                  style={{
                    borderColor: data.riqueza ? colors.accent : undefined,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Ingresa el monto inicial de inversión
              </p>
            </div>

            <div className="space-y-3 group">
              <label
                htmlFor="tasa"
                className="block text-sm font-medium transition-all duration-300 group-focus-within:font-semibold"
                style={{ color: colors.primary }}
              >
                Tasa de Interés Anual
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PercentIcon className="text-gray-400 w-4 h-4" />
                </div>
                <Input
                  name="tasa"
                  variant="ghost"
                  type="number"
                  onChange={handleChange}
                  value={data.tasa}
                  className="
                                        pl-10 pr-4 py-3 
                                        border-2 border-gray-300 
                                        rounded-xl 
                                        focus:border-accent 
                                        focus:ring-2 focus:ring-accent/20 
                                        transition-all duration-300
                                        hover:border-gray-400
                                        bg-white
                                    "
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="100"
                  style={{
                    borderColor: data.tasa ? colors.accent : undefined,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Porcentaje anual para el cálculo del VAN
              </p>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: `${colors.background}50`,
                borderColor: `${colors.primary}20`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${colors.accent}20` }}
                >
                  <AlertTriangle
                    className="w-3 h-3"
                    style={{ color: colors.accent }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: colors.primary }}
                  >
                    Información importante
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Estos datos son esenciales para el cálculo preciso del Valor
                    Actual Neto (VAN) y el análisis de escenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmitForm}
              disabled={!data.riqueza || !data.tasa}
              className="w-full  py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2disabled:opacity-50 disabled:cursor-not-allowedhover:shadow-lgactive:scale-95"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary,
              }}
            >
              <PercentIcon className="w-4 h-4" />
              Iniciar Simulación
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-sm bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden animate-dialog-in">
          <div className="px-6 py-6 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${colors.accent}20` }}
            >
              <AlertTriangle
                className="w-8 h-8"
                style={{ color: colors.accent }}
              />
            </div>

            <h3
              className="text-lg font-bold mb-2"
              style={{ color: colors.primary }}
            >
              ¿Estás seguro de salir?
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Tienes datos sin guardar. Si sales, perderás la información
              ingresada.
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelClose}
                className="flex-1 py-3 px-4 rounded-xl font-medium border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClose}
                className="flex-1 py-3 px-4 rounded-xl font-medium text-white transition-all duration-200hover:shadow-lgactive:scale-95"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                }}
              >
                Salir
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes dialog-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-dialog-in {
          animation: dialog-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
