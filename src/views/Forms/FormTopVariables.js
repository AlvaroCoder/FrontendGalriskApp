import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';


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

  const handleCheckboxChange = (index) => {
    const updatedValues = [...formValues];
    updatedValues[index].enabled = !updatedValues[index].enabled;
    setFormValues(updatedValues);
};
  const handleChange = (index, field, value) => {
    const updatedValues = [...formValues];
    updatedValues[index][field] = value;
    setFormValues(updatedValues);
  };

  const handleSubmit =async (e) => {
    try {
      e.preventDefault();
      const selectedValues = formValues
      .filter((item) => item.enabled)
      .map(({ enabled, ...rest }) => rest);
      
      await handleSubmitProcess(selectedValues);
    } catch (err) {
      console.log(err);
    } 
  };


  return (
    <div className='w-full p-4 rounded-lg shadow bg-white h-fit mt-4 flex flex-col items-center'>
      <h1 className='font-bold text-xl mb-4'>
        Seleccione cuales serían las variables más importantes
      </h1>
      
      <form onSubmit={handleSubmit} className='w-full overflow-x-auto'>
        <table className='w-full border border-gray-300 rounded-lg'>
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className='p-2 text-left'>Nombre de la Celda</th>
              <th className='p-2 text-left'>Nombre de la Hoja</th>
              <th className='p-2 text-left w-48 '>Posible Nombre</th>
              <th className='p-2 text-left'>Máximo</th>
              <th className='p-2 text-left'>Valor Actual</th>
              <th className='p-2 text-left'>Mínimo</th>
              <th className='p-2 text-left'>Distribución</th>
              <th className='p-2 text-left flex flex-row items-center justify-center'><p>VAN</p> <ChangeHistoryIcon/></th>
              <th className='p-2 text-left'><BorderColorIcon/></th>
            </tr>
          </thead>
          <tbody>
            {variablesTop.map((variable, index) => (
              <tr 
                key={index} 
                className={`border-t ${formValues[index].enabled ? 'bg-white' : 'bg-gray-200'}`}>
                <td className='p-2 font-medium'>{variable['Celda Raíz']}</td>
                <td className='p-2 font-medium'>{variable['Hoja Raíz']}</td>
                <td className='p-2 font-medium w-48'>{variable['Posible Nombre']}</td>
                <td className='p-2'>
                  <input
                    type='number'
                    className='border rounded px-2 py-1 w-24'
                    value={formValues[index].maximo}
                    disabled={!formValues[index].enabled}
                    onChange={(e) =>
                      handleChange(index, 'maximo', e.target.value)
                    }
                    required
                  />
                </td>
                <td className='p-2 text-gray-700'>
                  {variable['Valor Original']}
                </td>
                <td className='p-2'>
                  <input
                    type='number'
                    className='border rounded px-2 py-1 w-24'
                    value={formValues[index].minimo}
                    disabled={!formValues[index].enabled}
                    onChange={(e) =>
                      handleChange(index, 'minimo', e.target.value)
                    }
                    required
                  />
                </td>
                <td className='p-2'>
                  <select
                    className='border rounded px-2 py-1'
                    value={formValues[index].distribucion}
                    disabled={!formValues[index].enabled}
                    onChange={(e) =>
                      handleChange(index, 'distribucion', e.target.value)
                    }
                  >
                    {distribuciones.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {parseFloat(variable['Variación Absoluta']).toFixed(2)}
                </td>
                <td>
                    <FormControl>
                    <FormControlLabel 
                      control={
                        <Checkbox 
                          checked={formValues[index].enabled} 
                          onChange={() => handleCheckboxChange(index)} 
                          color='primary'
                        />
                      }
                    />
                    </FormControl>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='mt-4 flex flex-row items-center gap-4'>
        <button
            disabled={loading}
            type='submit'
            className='bg-nigth-blue text-white px-4 py-2 rounded-lg hover:bg-blue-950 w-full flex justify-center items-center'
          >
           {loading ? <Loader2 className='animate-spin'/> : <p> Iniciar Simulacion</p>}
          </button>
        </div>
      </form>
    </div>
  );
}