// AEROVIGIL - Resilience "What-If" Simulation Engine

const { calculateAssetReadiness, calculateFleetKpis } = require('./readinessEngine');

/**
 * Runs a dynamic "What-If" resilience simulation across assets, components & suppliers
 * 
 * @param {Array} originalAssets 
 * @param {Array} originalSuppliers 
 * @param {Array} originalComponents 
 * @param {Object} scenarioParams 
 */
function runSimulation(originalAssets, originalSuppliers, originalComponents, scenarioParams) {
  const {
    supplierDelayDays = 0,
    materialShortageCategory = 'NONE', // 'ALUMINUM', 'COMPOSITE', 'ELECTRONICS', 'BATTERY', 'NONE'
    workforceCapacityPercent = 100, // 0 to 100
    transportDisruptionLevel = 'LOW', // 'NONE', 'LOW', 'MEDIUM', 'HIGH'
    weights
  } = scenarioParams;

  // 1. Calculate baseline fleet KPIs
  const baselineAssets = originalAssets.map(a => {
    const calc = calculateAssetReadiness(a, weights);
    return { ...a, ...calc };
  });
  const baselineKpis = calculateFleetKpis(baselineAssets);

  // 2. Apply scenario impact to suppliers
  const simulatedSuppliers = originalSuppliers.map(sup => {
    let leadTimeInc = supplierDelayDays;
    let riskInc = Math.round(supplierDelayDays * 0.8);
    
    if (transportDisruptionLevel === 'HIGH') {
      leadTimeInc += 15;
      riskInc += 20;
    } else if (transportDisruptionLevel === 'MEDIUM') {
      leadTimeInc += 8;
      riskInc += 10;
    }

    const newLeadTime = sup.averageLeadTimeDays + leadTimeInc;
    const newRiskScore = Math.min(99, Math.max(0, sup.riskScore + riskInc));
    const newRiskLevel = newRiskScore > 50 ? 'HIGH' : newRiskScore > 30 ? 'MEDIUM' : 'LOW';

    return {
      ...sup,
      averageLeadTimeDays: newLeadTime,
      riskScore: newRiskScore,
      riskLevel: newRiskLevel
    };
  });

  // 3. Apply scenario impact to components
  let affectedComponentsCount = 0;
  const simulatedComponents = originalComponents.map(comp => {
    let stockImpact = 0;
    let isAffected = false;

    // Check material category matching
    if (materialShortageCategory !== 'NONE') {
      const matchMap = {
        'ALUMINUM': ['Turbine Blades', 'High-Temp Fuel Injector'],
        'COMPOSITE': ['Carbon Composite Spar', 'Thermal Shield Matrix'],
        'ELECTRONICS': ['Avionics Logic Board', 'Phased Array Module'],
        'BATTERY': ['Power Distribution Unit']
      };

      const targetCategories = matchMap[materialShortageCategory] || [];
      if (targetCategories.includes(comp.category)) {
        stockImpact = Math.ceil(comp.stock * 0.6); // 60% stock reduction
        isAffected = true;
      }
    }

    if (supplierDelayDays > 10) {
      isAffected = true;
    }

    if (isAffected) affectedComponentsCount++;

    const newStock = Math.max(0, comp.stock - stockImpact);
    return {
      ...comp,
      stock: newStock,
      status: newStock < comp.required ? 'SHORTAGE' : 'ADEQUATE'
    };
  });

  // 4. Recalculate affected assets
  let affectedAssetsCount = 0;
  const simulatedAssets = originalAssets.map(asset => {
    const matchingSupplier = simulatedSuppliers.find(s => s.id === asset.criticalSupplierId);
    const matchingComp = simulatedComponents.find(c => c.id === asset.criticalPartId);

    // Dynamic penalty calculations based on simulation parameters
    let supplierRiskScore = asset.supplierRiskScore;
    if (matchingSupplier) {
      supplierRiskScore = matchingSupplier.riskScore;
    } else if (supplierDelayDays > 0) {
      supplierRiskScore = Math.min(99, asset.supplierRiskScore + Math.round(supplierDelayDays * 0.75));
    }

    let partsAvail = asset.partsAvailability;
    if (matchingComp && matchingComp.status === 'SHORTAGE') {
      partsAvail = Math.max(15, partsAvail - 35);
    } else if (materialShortageCategory !== 'NONE') {
      partsAvail = Math.max(20, partsAvail - 25);
    }

    const maintCapacity = Math.round(workforceCapacityPercent);

    const tempAsset = {
      ...asset,
      supplierRiskScore,
      partsAvailability: partsAvail,
      maintenanceCapacity: maintCapacity
    };

    const calc = calculateAssetReadiness(tempAsset, weights);
    
    // Check if readiness degraded compared to baseline
    const originalCalc = calculateAssetReadiness(asset, weights);
    if (calc.readinessScore < originalCalc.readinessScore) {
      affectedAssetsCount++;
    }

    return {
      ...tempAsset,
      ...calc
    };
  });

  const simulatedKpis = calculateFleetKpis(simulatedAssets);
  const readinessImpact = simulatedKpis.overallReadiness - baselineKpis.overallReadiness;
  
  // Estimate recovery days based on magnitude of disruption
  const estimatedRecoveryDays = Math.max(3, Math.round(
    (supplierDelayDays * 0.8) +
    (materialShortageCategory !== 'NONE' ? 14 : 0) +
    ((100 - workforceCapacityPercent) * 0.3) +
    (transportDisruptionLevel === 'HIGH' ? 12 : transportDisruptionLevel === 'MEDIUM' ? 6 : 0)
  ));

  return {
    scenarioParams,
    baselineKpis,
    simulatedKpis,
    impactSummary: {
      affectedAssetsCount,
      readinessImpactPercent: readinessImpact, // Negative e.g. -8%
      criticalComponentsAffected: affectedComponentsCount,
      estimatedRecoveryDays
    },
    simulatedAssets,
    simulatedSuppliers,
    aiSimulationSummary: `Simulated disruption results in a ${Math.abs(readinessImpact)}% change in fleet readiness. ${affectedAssetsCount} assets experience degraded readiness index. Expected supply-chain recovery window: ${estimatedRecoveryDays} days.`
  };
}

module.exports = {
  runSimulation
};
