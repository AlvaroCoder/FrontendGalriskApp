"use client";
import {
  extraerVariablesTop,
  getDataCellValue,
  getDataExcelByIdExcel,
  getDocumentExcel,
  processData,
} from "@/lib/apiConnection";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import { TextField } from "@mui/material";
import FormTopVariables from "./Forms/FormTopVariables";
import DialogAdditionalDetails from "@/elements/Dialogs/DialogAdditionalDetails";

function getExcelColumnName(n) {
  let name = "";
  while (n > 0) {
    let remainder = (n - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}
const colors = {
  primary: "#1B263B",
  accent: "#FFC525",
  background: "#F5F6FA",
};
export default function ViewExcelVisor({
  idExcel = "",
  handleSetEscenarios = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [variablesTop, setVariablesTop] = useState(null);
  const [numeroVariablesTop, setNumeroVariablesTop] = useState("10");
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
          blankrows: true,
          defval: "",
        });
        setSheetData(data);
      } catch (error) {
        toast("No se logró extraer el documento", {
          type: "error",
          position: "bottom-right",
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
        blankrows: true,
        defval: "",
      });
      setSheetData(data);
    }
  };

  const handleCellClick = async (rowIndex, colIndex, value) => {
    setValorCeldaSeleccionada(null);
    if (workbook && selectedSheet) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      const worksheet = workbook.Sheets[selectedSheet];
      const cell = worksheet[cellAddress];
      if (cell && cell.f) {
        const formulaUpper = cell.f.toUpperCase();

        if (formulaUpper.startsWith("VAN") || formulaUpper.startsWith("NPV")) {
          const VAB = formulaUpper?.split("+");

          if (VAB?.length > 1) {
            const response = await getDataCellValue(
              idExcel,
              selectedSheet,
              cellAddress
            );
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

  const handleClickExtraerTopVariables = async () => {
    const letraCelda =
      String.fromCharCode(64 + selectedCell.col) + String(selectedCell.row);
    const responseExcel = await getDataExcelByIdExcel(idExcel);
    const responseExcelJSON = await responseExcel.json();

    const rutaExcel = responseExcelJSON?.ruta_excel;
    const dataVariable = {
      hoja: selectedSheet,
      rutaExcel,
      celda: letraCelda,
    };
    const variablesTop = await extraerVariablesTop(
      dataVariable,
      numeroVariablesTop
    );

    setRutaExcel(rutaExcel);
    const variablesTopJSON = await variablesTop.json();

    setVariablesTop(variablesTopJSON?.resultadosTop);
  };

  const handleSubmitAdditionDetails = async (data) => {
    try {
      setLoading(true);
      const letraCelda =
        String.fromCharCode(64 + selectedCell.col) + String(selectedCell.row);

      const newDataToSend = {
        rutaExcel,
        celdaObjetivo: letraCelda,
        hojaObjetivo: selectedSheet,
        variables: formValuesData,
        topResultados: variablesTop,
        tasaInteres: parseFloat(data?.tasa),
      };

      const responseProcess = await processData(newDataToSend);

      const responseProcessJSON = await responseProcess.json();
      console.log(responseProcessJSON);

      handleSetEscenarios(
        responseProcessJSON?.escenarios,
        responseProcessJSON?.resultadosVAN,
        valorCeldaSeleccionada[valorCeldaSeleccionada?.length - 1] * -1,
        parseInt(data?.riqueza)
      );

      toast("Se proceso la data correctamente", {
        type: "success",
        position: "bottom-right",
      });

      setOpenDetailData(false);
    } catch (err) {
      console.log(err);

      toast("No se pudo procesar la data", {
        type: "error",
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    if (openDetailData) {
      setOpenDetailData(false);
    }
  };

  const handleSubmitProcess = async (formValues) => {
    setFormValuesData(formValues);
    setOpenDetailData(true);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "##F5F6FA" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-slide-down">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Visor de Excel
          </h1>
          <p className="text-gray-600" style={{ color: colors.primary }}>
            Visualiza y analiza tu archivo Excel
          </p>
        </div>
        <DialogAdditionalDetails
          open={openDetailData}
          handleSubmit={handleSubmitAdditionDetails}
          handleChangeOpen={handleOpen}
        />
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: colors.accent }}
            ></div>
          </div>
        )}

        {!loading && sheetNames.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-50 border border-green-200 flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                        stroke="#21A366"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Hoja actual</h3>
                    <p className="text-sm text-gray-600">{selectedSheet}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Filas: {sheetData.length}
                  </p>
                  <p className="text-sm text-gray-500">
                    Columnas: {sheetData[0]?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-6 py-3 border-b border-gray-200 overflow-x-auto">
              <div className="flex space-x-2 min-w-max">
                {sheetNames.map((sheet, index) => (
                  <button
                    key={index}
                    onClick={() => handleSheetChange(sheet)}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                      flex items-center gap-2 min-w-[120px] justify-center
                      border-2 hover:scale-105 active:scale-95
                      ${selectedSheet === sheet 
                        ? 'bg-white border-accent shadow-md text-gray-800 font-semibold' 
                        : 'bg-gray-200 border-transparent text-gray-600 hover:bg-gray-300'
                      }
                    `}
                    style={{
                      borderColor: selectedSheet === sheet ? colors.accent : undefined
                    }}
                  >
                    <div className={`
                      w-2 h-2 rounded-full
                      ${selectedSheet === sheet ? 'bg-accent' : 'bg-gray-400'}
                    `} style={{
                      backgroundColor: selectedSheet === sheet ? colors.accent : undefined
                    }} />
                    <span className="truncate">{sheet}</span>
                  </button>
                ))}
              </div>
            </div>

                        <div className="overflow-auto max-h-[500px] bg-white">
              <table className="min-w-full border-collapse">
                <thead className="sticky top-0 z-20">
                  <tr>
                    <th className="w-16 bg-gray-100 border border-gray-300 px-2 py-2 text-sm font-semibold text-gray-600 sticky left-0 z-10">
                      #
                    </th>
                    {sheetData[0]?.map((_, j) => {
                      const columnLetter = getExcelColumnName(j + 1);
                      return (
                        <th
                          key={j}
                          className="min-w-[120px] bg-gray-100 border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          {columnLetter}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {sheetData.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 group">
                      <td className="bg-gray-50 border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 text-center sticky left-0 z-10 group-hover:bg-gray-100">
                        {i + 1}
                      </td>
                      {Array.from({ length: sheetData[0]?.length || 0 }).map((_, j) => {
                        const cellValue = row[j] || "";
                        const isSelected = selectedCell?.row === i + 1 && selectedCell?.col === j + 1;

                        const formattedCell = typeof cellValue === "number" 
                          ? cellValue.toFixed(2) 
                          : cellValue;

                        return (
                          <td
                            key={j}
                            className={`
                              min-w-[120px] border border-gray-300 px-4 py-3 text-sm cursor-pointer
                              transition-all duration-150 hover:bg-blue-50/50
                              ${isSelected 
                                ? 'bg-accent/20 ring-2 ring-accent font-semibold' 
                                : 'bg-white'
                              }
                            `}
                            onClick={() => handleCellClick(i, j, cellValue)}
                            style={{
                              backgroundColor: isSelected ? `${colors.accent}20` : undefined,
                              borderColor: isSelected ? colors.accent : undefined
                            }}
                          >
                            <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {formattedCell}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedCell && (
               <div className="border-t border-gray-200 bg-white">
              <section>
                <div className="mt-4 p-3 bg-white shadow rounded-lg border">
                  <p>
                    <strong>Celda:</strong> Fila : {selectedCell.row}, Columna :{" "}
                    {selectedCell.col}, Celda :{" "}
                    {String.fromCharCode(64 + selectedCell.col)}, Hoja :{" "}
                    {selectedSheet}
                  </p>
                  <p>
                    <strong>Valor:</strong> {selectedCell.value}
                  </p>
                  {valorCeldaSeleccionada && (
                    <section>
                      <p>
                        <strong>WACC :</strong> {valorCeldaSeleccionada[0]}
                      </p>
                      <p>
                        <strong>Inversion Inicial :</strong>{" "}
                        {valorCeldaSeleccionada[
                          valorCeldaSeleccionada?.length - 1
                        ] * -1}
                      </p>
                    </section>
                  )}
                </div>
                <div className="w-full flex flex-row gap-4 items-center mt-4">
                  <TextField
                    className="bg-white"
                    label="Variables"
                    type="number"
                    value={numeroVariablesTop}
                    onChange={(e) => setNumeroVariablesTop(e.target.value)}
                  />
                  <button
                    disabled={loading}
                    onClick={handleClickExtraerTopVariables}
                    className="text-white bg-yellow-intense cursor-pointer p-4 rounded-sm shadow hover:bg-amber-500 flex justify-center w-full "
                  >
                    <p className="flex flex-row items-center gap-4">
                      <StackedLineChartIcon /> Extraer Variables Top
                    </p>
                  </button>
                </div>
              </section>
                </div>
            )}
          </div>
        )}
        {variablesTop && (
          <div className="mt-6 animate-slide-up">
            <FormTopVariables
              loading={loading}
              variablesTop={variablesTop}
              handleSubmitProcess={handleSubmitProcess}
            />
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
