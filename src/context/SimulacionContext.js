"use client";
import { createContext, useContext, useState } from "react";

const SimulacionContext = createContext({
  simulacionData: {},
  setSimulacionResults: () => { },
  clearSimulacionData : () => { },
});

export function SimluacionProvider({ children }) {
  const [simulacionData, setSimulacionData] = useState(null);

  const setSimulacionResults = (data) => {
    setSimulacionData(data);
  };

  const clearSimulacionData = () => {
    setSimulacionData(null);
  };

  return (
    <SimulacionContext.Provider
      value={{
        simulacionData,
        setSimulacionResults,
        clearSimulacionData,
      }}
    >
      {children}
    </SimulacionContext.Provider>
  );
}

export const useSimulation = () => {
  const context = useContext(SimulacionContext);
  if (!context) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
