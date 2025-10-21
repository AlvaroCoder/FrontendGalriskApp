'use client';
import { extraerVariablesTop, getDataCellValue, getDataExcelByIdExcel, getDocumentExcel, processData } from '@/lib/apiConnection';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { TextField } from '@mui/material';
import FormTopVariables from './Forms/FormTopVariables';
import DialogAdditionalDetails from '@/elements/Dialogs/DialogAdditionalDetails';

function getExcelColumnName(n) {
    let name = "";
    while (n > 0) {
      let remainder = (n - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      n = Math.floor((n - 1) / 26);
    }
    return name;
  }
export default function ViewExcelVisor({ idExcel = "" , handleSetEscenarios=()=>{}}) {
    const [loading, setLoading] = useState(false);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState("");
    const [sheetData, setSheetData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null); // Celda seleccionada
    const [workbook, setWorkbook] = useState(null); 
    const [variablesTop, setVariablesTop] = useState(null);
    const [numeroVariablesTop, setNumeroVariablesTop] = useState('10');
    const [rutaExcel, setRutaExcel] = useState(null);
    const [valorCeldaSeleccionada, setValorCeldaSeleccionada] = useState(null);
    const [openDetailData, setOpenDetailData] = useState(false);
    const [formValuesData, setFormValuesData] = useState(null);
  
  useEffect(() => {
    async function fetchExcelDocument() {
      try {
        setLoading(true);
        
        const response = await getDocumentExcel(idExcel);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const wb = XLSX.read(arrayBuffer, { type: "array" });
        setWorkbook(wb);

        setSheetNames(wb.SheetNames);
        const firstSheet = wb.SheetNames[0];
        setSelectedSheet(firstSheet);


        const worksheet = wb.Sheets[firstSheet];
        const data = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          blankrows : true,
        defval : "",
       });
        setSheetData(data);


      } catch (error) {
        toast("No se logró extraer el documento", {
          type: 'error',
          position: 'bottom-right'
        });
      } finally {
        setLoading(false);
      }
    }
    if (idExcel) fetchExcelDocument();
  }, [idExcel]);


  const handleSheetChange = (e) => {
    const newSheet = e.target.value;
    setSelectedSheet(newSheet);
  
    if (workbook) {
      const worksheet = workbook.Sheets[newSheet];
      const data = XLSX.utils.sheet_to_json(worksheet, {    
        header: 1,
        blankrows : true,
        defval : "", });
      setSheetData(data);
    }
  };

  const handleCellClick = async(rowIndex, colIndex, value) => {
    setValorCeldaSeleccionada(null);
    if (workbook && selectedSheet) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex});
      const worksheet = workbook.Sheets[selectedSheet]
      const cell = worksheet[cellAddress];
      if (cell && cell.f) {
  
        const formulaUpper = cell.f.toUpperCase();
        
        if (formulaUpper.startsWith("VAN") || formulaUpper.startsWith("NPV")) {
          const VAB = formulaUpper?.split("+");
          
          if (VAB?.length > 1) {
            const response = await getDataCellValue(idExcel, selectedSheet, cellAddress);
            const responseJSON = await response.json();
            console.log(responseJSON);
            
            setValorCeldaSeleccionada(responseJSON?.valores);
          }
        }
      } else {
        console.log(`Celda ${cellAddress} no tiene fórmula`);
      }
    }
    setSelectedCell({ row: rowIndex + 1, col: colIndex + 1, value });
  };

  const handleClickExtraerTopVariables=async()=>{
    const letraCelda = String.fromCharCode(64 + selectedCell.col)+String(selectedCell.row);
    const responseExcel = await getDataExcelByIdExcel(idExcel)
    const responseExcelJSON = await responseExcel.json();
    
    const rutaExcel = responseExcelJSON?.ruta_excel;
    const dataVariable={
      hoja : selectedSheet,
      rutaExcel,
      celda : letraCelda
  }    
    const variablesTop = await extraerVariablesTop(dataVariable, numeroVariablesTop);
    
    setRutaExcel(rutaExcel);
    const variablesTopJSON = await variablesTop.json();
    
    setVariablesTop(variablesTopJSON?.resultadosTop);
    
  }

  const handleSubmitAdditionDetails = async (data) => { 
 
    
    try { 
      setLoading(true);
      const letraCelda = String.fromCharCode(64 + selectedCell.col)+String(selectedCell.row);

        const newDataToSend = {
            rutaExcel,
            celdaObjetivo : letraCelda,
            hojaObjetivo : selectedSheet,
            variables : formValuesData,
            topResultados: variablesTop,
            tasaInteres : parseFloat(data?.tasa)
        }       
      
        const responseProcess = await processData(newDataToSend);
        
        const responseProcessJSON = await responseProcess.json();
        console.log(responseProcessJSON);
        
      handleSetEscenarios(
        responseProcessJSON?.escenarios,
        responseProcessJSON?.resultadosVAN,
        valorCeldaSeleccionada[valorCeldaSeleccionada?.length - 1] * -1,
        parseInt(data?.riqueza)
      );

        toast("Se proceso la data correctamente",{
            type : 'success',
            position : 'bottom-right'
        });
        
      setOpenDetailData(false);
    } catch (err) {
      console.log(err);
      
        toast("No se pudo procesar la data",{
            type : 'error',
            position : 'bottom-center'
        })
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = () => {
    if (openDetailData) {
      setOpenDetailData(false);
    }
  }

  const handleSubmitProcess=async(formValues)=>{
    setFormValuesData(formValues)
      setOpenDetailData(true);
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md">
      <DialogAdditionalDetails
        open={openDetailData}
        handleSubmit={handleSubmitAdditionDetails}
        handleChangeOpen={handleOpen}
      />
  {loading && <p className="text-center text-gray-600">Cargando Excel...</p>}

  {!loading && sheetNames.length > 0 && (
    <>
      <div className="mb-4 flex items-center gap-3">
        <label className="font-semibold">Selecciona hoja:</label>
        <select
          value={selectedSheet}
          onChange={handleSheetChange}
          className="border rounded-lg p-2 shadow-sm bg-white"
        >
          {sheetNames.map((sheet, index) => (
            <option key={index} value={sheet}>{sheet}</option>
          ))}
        </select>
      </div>

      <div className="overflow-auto max-h-[500px] border border-gray-300 rounded-lg">
    <table className="table-fixed border-collapse w-full">
        <thead className="sticky top-0 bg-gray-200 z-10">
            <tr>
                {Array.from({ length: sheetData.length }).map((_, j) => {
                const columnLetter = getExcelColumnName(j + 1);
                return (
                    <th
                    key={j}
                    className="border w-[150px] border-gray-400 px-3 py-2 text-sm font-semibold bg-gray-200"
                    >
                    {columnLetter}
                    </th>
                );
                })}
            </tr>
        </thead>
        <tbody>
        {sheetData.map((row, i) => (
            <tr key={i} className="hover:bg-gray-100">
            {Array.from({ length: sheetData.length }).map((_, j) => {
                const cellValue = row[j] || "";
                const isSelected =
                selectedCell?.row === i + 1 &&
                selectedCell?.col === j + 1;

                const formattedCell =
                typeof cellValue === "number"
                    ? cellValue.toFixed(2)
                    : cellValue;

                return (
                <td
                    key={j}
                    className={`border border-gray-300 px-3 py-2 text-sm cursor-pointer w-[150px] whitespace-normal break-words ${
                    isSelected ? 'bg-yellow-200 font-semibold' : ''
                    }`}
                    onClick={() => handleCellClick(i, j, cellValue)}
                >
                    {formattedCell}
                </td>
                );
            })}
            </tr>
        ))}
        </tbody>
    </table>
</div>
        {selectedCell && (
                <section>
                    <div className="mt-4 p-3 bg-white shadow rounded-lg border">
                        <p><strong>Celda:</strong> Fila : {selectedCell.row}, Columna : {selectedCell.col}, Celda : {String.fromCharCode(64+selectedCell.col)}, Hoja : {selectedSheet}</p>
                        <p><strong>Valor:</strong> {selectedCell.value}</p>
                        {valorCeldaSeleccionada &&
                        <section>
                          <p><strong>WACC :</strong> {valorCeldaSeleccionada[0]}</p>
                          <p><strong>Inversion Inicial :</strong> {valorCeldaSeleccionada[valorCeldaSeleccionada?.length-1]*-1}</p>
                        </section>}
                    </div>
                    <div className='w-full flex flex-row gap-4 items-center mt-4'>
                        <TextField
                            className='bg-white'
                            label="Variables"
                            type='number'
                            value={numeroVariablesTop}
                            onChange={(e)=>setNumeroVariablesTop(e.target.value)}
                        />
                        <button 
                            disabled={loading}
                            onClick={handleClickExtraerTopVariables}
                            className='text-white bg-yellow-intense cursor-pointer p-4 rounded-sm shadow hover:bg-amber-500 flex justify-center w-full '>
                            <p className='flex flex-row items-center gap-4'><StackedLineChartIcon/> Extraer Variables Top</p>
                        </button>
                    </div>
                </section>
            )}
            </>
        )}
        {
            variablesTop && 
            <FormTopVariables
                loading={loading}
                variablesTop={variablesTop}
                handleSubmitProcess={handleSubmitProcess}
            />
        }
</div>
  );
}