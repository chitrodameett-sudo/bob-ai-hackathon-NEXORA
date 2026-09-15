// NEXORA — Fleet Health Context
// Provides shared fleet scan state across all pages.
// Statuses: READY | MAINTENANCE | CRITICAL  (LIMITED removed)

import React, { createContext, useContext, useState, useCallback } from 'react';
import { getFleet, reScanFleet, getFleetStats, getCategoryStats, defaultFleetSort } from '../utils/fleetData';

const FleetHealthContext = createContext(null);

export function FleetHealthProvider({ children }) {
  const [fleet, setFleet] = useState(() => getFleet());
  const [lastScanTime, setLastScanTime] = useState(null);
  const [scanCount, setScanCount] = useState(0);

  const stats = getFleetStats(fleet);
  const categoryStats = getCategoryStats(fleet);
  // Pre-sorted fleet: MAINTENANCE → READY → CRITICAL
  const sortedFleet = defaultFleetSort(fleet);

  const runFleetScan = useCallback(() => {
    const newFleet = reScanFleet();
    setFleet(newFleet);
    setLastScanTime(new Date());
    setScanCount(c => c + 1);
    return newFleet;
  }, []);

  return (
    <FleetHealthContext.Provider value={{
      fleet,
      sortedFleet,
      stats,
      categoryStats,
      lastScanTime,
      scanCount,
      runFleetScan,
    }}>
      {children}
    </FleetHealthContext.Provider>
  );
}

export const useFleetHealth = () => {
  const ctx = useContext(FleetHealthContext);
  if (!ctx) throw new Error('useFleetHealth must be used within FleetHealthProvider');
  return ctx;
};
