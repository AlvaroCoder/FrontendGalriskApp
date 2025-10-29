import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';

const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA"
};

export default function FormTopVariables({ 
    variablesTop = [],
    handleSubmitProcess=async()=>{},
    loading=false
}) {
  const distribuciones = ['Normal', 'Triangular', 'PERT'];

  const [formValues, setFormValues] = useState(
    variablesTop.map((variable) => ({
      celda: variable['Celda Raíz'],
      hoja : variable['Hoja Raíz'],
      maximo: '',
      minimo: '',
      distribucion: 'Normal',
      moda : variable['Valor Original'],
      enabled: false
    }))
  );

  const [validationErrors, setValidationErrors] = useState(
    variablesTop.map(() => ({ minimo: '', maximo: '' }))
  );
  const handleCheckboxChange = (index) => {
    const updatedValues = [...formValues];
    updatedValues[index].enabled = !updatedValues[index].enabled;
    setFormValues(updatedValues);
    
    if (!updatedValues[index].enabled) {
      const updatedErrors = [...validationErrors];
      updatedErrors[index] = { minimo: '', maximo: '' };
      setValidationErrors(updatedErrors);
    }
  };

    const validateInput = (index, field, value, originalValue) => {
    const numValue = parseFloat(value);
    const numOriginal = parseFloat(originalValue);

    if (isNaN(numValue)) return '';

    if (field === 'minimo' && numValue >= numOriginal) {
      return 'Ingresa numero menor';
    }

    if (field === 'maximo' && numValue <= numOriginal) {
      return 'Ingresa numero mayor';
    }

    return '';
    };
  
  const handleChange = (index, field, value) => {
    const updatedValues = [...formValues];
    updatedValues[index][field] = value;
    setFormValues(updatedValues);

    const originalValue = variablesTop[index]['Valor Original'];
    const error = validateInput(index, field, value, originalValue);
    
    const updatedErrors = [...validationErrors];
    updatedErrors[index] = {
      ...updatedErrors[index],
      [field]: error
    };
    setValidationErrors(updatedErrors);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      const hasErrors = formValues.some((item, index) => {
        if (!item.enabled) return false;
        
        const originalValue = variablesTop[index]['Valor Original'];
        const minError = validateInput(index, 'minimo', item.minimo, originalValue);
        const maxError = validateInput(index, 'maximo', item.maximo, originalValue);
        
        return minError || maxError;
      });

      if (hasErrors) {
        alert('Por favor corrige los errores de validación antes de continuar');
        return;
      }

      const selectedValues = formValues
        .filter((item) => item.enabled)
        .map(({ enabled, ...rest }) => rest);
      
      await handleSubmitProcess(selectedValues);
    } catch (err) {
      console.log(err);
    } 
  };

  const getVariationColor = (variation) => {
    const value = parseFloat(variation);
    if (value > 0) return 'text-green-600 bg-green-50';
    if (value < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getVariationIcon = (variation) => {
    const value = parseFloat(variation);
    if (value > 0) return '▲';
    if (value < 0) return '▼';
    return '●';
  };

  return (
     <div className="w-full max-w-7xl mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
          Configuración de Variables
        </h1>
        <p className="text-gray-600" style={{ color: colors.primary }}>
          Selecciona y configura las variables más importantes para la simulación
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center">
                <ChangeHistoryIcon className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Variables Seleccionadas</h3>
                <p className="text-sm text-gray-600">
                  {formValues.filter(item => item.enabled).length} de {variablesTop.length} variables activas
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Prioridad más alta</p>
              <p className="text-sm font-medium text-gray-700">
                {variablesTop[0]?.['Posible Nombre'] || 'N/A'}
              </p>
            </div>
          </div>
        </div>
          <form onSubmit={handleSubmit} className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[150px]">
                    Variable
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[120px]">
                    Hoja
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[180px]">
                    Posible Nombre
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[120px]">
                    Valor Actual
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[120px]">
                    Mínimo
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[120px]">
                    Máximo
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[140px]">
                    Distribución
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <span>Impacto VAN</span>
                      <ChangeHistoryIcon className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700 min-w-[80px]">
                    <BorderColorIcon className="w-5 h-5" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {variablesTop.map((variable, index) => (
                  <tr 
                    key={index} 
                    className={`
                      border-b border-gray-200 transition-all duration-200
                      ${formValues[index].enabled 
                        ? 'bg-white hover:bg-gray-50' 
                        : 'bg-gray-50/50 hover:bg-gray-100'
                      }
                    `}
                  >
                    {/* Celda */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                          ${formValues[index].enabled 
                            ? 'bg-accent text-white' 
                            : 'bg-gray-300 text-gray-600'
                          }
                        `} style={{
                          backgroundColor: formValues[index].enabled ? colors.accent : undefined
                        }}>
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">
                          {variable['Celda Raíz']}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {variable['Hoja Raíz']}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-medium text-gray-800">
                        {variable['Posible Nombre']}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                        <span className="font-semibold text-blue-700 text-sm">
                          {variable['Valor Original']}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="relative">
                        <input
                          type="number"
                          className={`
                            w-full px-3 py-2 rounded-lg border-2 transition-all duration-200
                            focus:ring-2 focus:ring-accent/20 outline-none
                            ${validationErrors[index].minimo 
                              ? 'border-red-300 focus:border-red-500' 
                              : formValues[index].enabled 
                                ? 'border-gray-300 hover:border-gray-400 focus:border-accent' 
                                : 'border-gray-200'
                            }
                            ${formValues[index].enabled ? 'bg-white' : 'bg-gray-100 text-gray-500'}
                          `}
                          value={formValues[index].minimo}
                          disabled={!formValues[index].enabled}
                          onChange={(e) => handleChange(index, 'minimo', e.target.value)}
                          placeholder={formValues[index].enabled ? "Ej: " + String(parseFloat(variable['Valor Original']) - 5) : "Mín"}
                          required={formValues[index].enabled}
                        />
                        {validationErrors[index].minimo && (
                          <div className="absolute -bottom-4 left-0 w-full">
                            <p className="text-xs text-red-500 font-medium mt-1">
                              {validationErrors[index].minimo}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="relative">
                        <input
                          type="number"
                          className={`
                            w-full px-3 py-2 rounded-lg border-2 transition-all duration-200
                            focus:ring-2 focus:ring-accent/20 outline-none
                            ${validationErrors[index].maximo 
                              ? 'border-red-300 focus:border-red-500' 
                              : formValues[index].enabled 
                                ? 'border-gray-300 hover:border-gray-400 focus:border-accent' 
                                : 'border-gray-200'
                            }
                            ${formValues[index].enabled ? 'bg-white' : 'bg-gray-100 text-gray-500'}
                          `}
                          value={formValues[index].maximo}
                          disabled={!formValues[index].enabled}
                          onChange={(e) => handleChange(index, 'maximo', e.target.value)}
                          placeholder={formValues[index].enabled ? "Ej: " + String(parseFloat(variable['Valor Original']) + 5) : "Máx"}
                          required={formValues[index].enabled}
                        />
                        {validationErrors[index].maximo && (
                          <div className="absolute -bottom-4 left-0 w-full">
                            <p className="text-xs text-red-500 font-medium mt-1">
                              {validationErrors[index].maximo}
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Distribución */}
                    <td className="p-4">
                      <select
                        className={`
                          w-full px-3 py-2 rounded-lg border-2 transition-all duration-200
                          focus:ring-2 focus:ring-accent/20 outline-none
                          ${formValues[index].enabled 
                            ? 'border-gray-300 hover:border-gray-400 focus:border-accent bg-white' 
                            : 'border-gray-200 bg-gray-100 text-gray-500'
                          }
                        `}
                        value={formValues[index].distribucion}
                        disabled={!formValues[index].enabled}
                        onChange={(e) => handleChange(index, 'distribucion', e.target.value)}
                      >
                        {distribuciones.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Variación Absoluta */}
                    <td className="p-4">
                      <div className={`
                        px-3 py-2 rounded-lg text-center font-semibold text-sm
                        ${getVariationColor(variable['Variación Absoluta'])}
                      `}>
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs">
                            {getVariationIcon(variable['Variación Absoluta'])}
                          </span>
                          {parseFloat(variable['Variación Absoluta']).toFixed(2)}
                        </div>
                      </div>
                    </td>

                    {/* Checkbox */}
                    <td className="p-4">
                      <div className="flex justify-center">
                        <FormControl>
                          <FormControlLabel 
                            control={
                              <Checkbox 
                                checked={formValues[index].enabled} 
                                onChange={() => handleCheckboxChange(index)} 
                                sx={{
                                  color: colors.accent,
                                  '&.Mui-checked': {
                                    color: colors.accent,
                                  },
                                }}
                              />
                            }
                          />
                        </FormControl>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón de envío */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {formValues.filter(item => item.enabled).length > 0 ? (
                  <span className="text-green-600 font-medium">
                    {formValues.filter(item => item.enabled).length} variable(s) seleccionada(s)
                  </span>
                ) : (
                  <span className="text-orange-600">
                    Selecciona al menos una variable para continuar
                  </span>
                )}
              </div>
              <button
                disabled={loading || formValues.filter(item => item.enabled).length === 0}
                type="submit"
                className={`
                  px-8 py-3 rounded-xl font-semibold transition-all duration-300
                  flex items-center gap-3 min-w-[200px] justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:shadow-lg active:scale-95
                `}
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <ChangeHistoryIcon className="w-5 h-5" />
                    <span>Iniciar Simulación</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
        </div>
    </div>
  );
}