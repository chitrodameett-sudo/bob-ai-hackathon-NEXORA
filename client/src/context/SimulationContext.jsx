import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const [params, setParams] = useState({
    supplierDelayDays: 0,
    materialShortageCategory: 'NONE',
    workforceCapacityPercent: 100,
    transportDisruptionLevel: 'NONE'
  });

  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Trigger recalculation when params change and simulation is active
  const triggerSimulation = async (customParams = params) => {
    setSimulating(true);
    const res = await api.runSimulation(customParams);
    setSimulating(false);

    if (res && res.success) {
      setSimulationData(res.data);
      setSimulationActive(
        customParams.supplierDelayDays > 0 ||
        customParams.materialShortageCategory !== 'NONE' ||
        customParams.workforceCapacityPercent < 100 ||
        customParams.transportDisruptionLevel !== 'NONE'
      );
    }
  };

  const updateParam = (key, value) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    triggerSimulation(newParams);
  };

  const resetSimulation = () => {
    const reset = {
      supplierDelayDays: 0,
      materialShortageCategory: 'NONE',
      workforceCapacityPercent: 100,
      transportDisruptionLevel: 'NONE'
    };
    setParams(reset);
    setSimulationActive(false);
    setSimulationData(null);
  };

  return (
    <SimulationContext.Provider value={{
      params,
      updateParam,
      simulationActive,
      simulationData,
      simulating,
      triggerSimulation,
      resetSimulation
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => useContext(SimulationContext);
