'use client';
import { getDataExcelByIdExcel, getDataExcelByIdUser, getDocumentExcel, processData } from '@/lib/apiConnection';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';

function getExcelColumnName(n) {
    let name = "";
    while (n > 0) {
      let remainder = (n - 1) % 26;
      name = String.fromCharCode(65 + remainder) + name;
      n = Math.floor((n - 1) / 26);
    }
    return name;
  }
export default function ViewExcelVisor({ idExcel = "" }) {
  const [loading, setLoading] = useState(false);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null); // Celda seleccionada
  const [workbook, setWorkbook] = useState(null); 

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
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
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
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setSheetData(data);
    }
  };

  const handleCellClick = (rowIndex, colIndex, value) => {
    setSelectedCell({ row: rowIndex + 1, col: colIndex + 1, value });
  };

  const handleClickProcessData=async()=>{
    const letraCelda = String.fromCharCode(65 + selectedCell.col)+String(selectedCell.row);
    const responseExcel = await getDataExcelByIdExcel(idExcel)
    const responseExcelJSON = await responseExcel.json();
    
    const rutaExcel = responseExcelJSON?.ruta_excel;
    const responseProcessData = await processData({
        hoja : selectedSheet,
        rutaExcel,
        celda : letraCelda
    });
    console.log(await responseProcessData.json());
    
  }

  return (
<div className="p-4 bg-gray-50 rounded-lg shadow-md">
  {loading && <p className="text-center text-gray-600">Cargando Excel...</p>}

  {!loading && sheetNames.length > 0 && (
    <>
      {/* Selector de hoja */}
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

      {/* Tabla del Excel con estilo tipo Excel */}
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

      {/* Información de la celda seleccionada */}
      {selectedCell && (
        <section>
            <div className="mt-4 p-3 bg-white shadow rounded-lg border">
                <p><strong>Celda:</strong> Fila : {selectedCell.row}, Columna : {selectedCell.col}, Hoja : {selectedSheet}</p>
                <p><strong>Valor:</strong> {selectedCell.value}</p>
            </div>
            <button 
                onClick={handleClickProcessData}
                className='text-white bg-yellow-intense cursor-pointer p-4 rounded-sm shadow hover:bg-amber-500 flex justify-center w-full mt-4 '>
                <p className='flex flex-row items-center gap-4'><StackedLineChartIcon/> Procesar Informacion</p>
            </button>
        </section>
      )}
    </>
  )}
</div>
  );
}