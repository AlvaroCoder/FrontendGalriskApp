"use client";
import { createContext, useContext, useMemo, useState } from "react";

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
  const contextValue = useMemo(() => ({
    simulacionData,
    setSimulacionResults,
    clearSimulacionData,
  }), [simulacionData]);
  
  return (
    <SimulacionContext.Provider
      value={contextValue}
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
