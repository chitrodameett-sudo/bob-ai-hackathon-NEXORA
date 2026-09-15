// AEROVIGIL - Readiness Intelligence Calculation Engine

const DEFAULT_WEIGHTS = {
  health: 0.35,
  parts: 0.25,
  maintenance: 0.15,
  supplier: 0.15,
  capacity: 0.10
};

/**
 * Calculates dynamic readiness score for an asset based on multi-domain factors
 */
function calculateAssetReadiness(asset, weights = DEFAULT_WEIGHTS) {
  const healthScore = Math.max(0, Math.min(100, asset.healthScore || 80));
  const partsAvail = Math.max(0, Math.min(100, asset.partsAvailability || 80));
  const maintStatus = Math.max(0, Math.min(100, asset.maintenanceStatus || 80));
  
  // Supplier Resilience is inverted supplier risk score (100 - risk)
  const supplierRisk = asset.supplierRiskScore || 20;
  const supplierResilience = Math.max(0, Math.min(100, 100 - supplierRisk));
  
  const capacity = Math.max(0, Math.min(100, asset.maintenanceCapacity || 80));

  const weightedScore = (
    (healthScore * (weights.health || 0.35)) +
    (partsAvail * (weights.parts || 0.25)) +
    (maintStatus * (weights.maintenance || 0.15)) +
    (supplierResilience * (weights.supplier || 0.15)) +
    (capacity * (weights.capacity || 0.10))
  );

  const readinessScore = Math.round(weightedScore);
  const status = readinessScore >= 85 ? 'OPERATIONAL' : readinessScore >= 70 ? 'UNDER_MAINTENANCE' : 'AT_RISK';

  // AI Explanation generator
  const reasons = [];
  if (healthScore < 75) reasons.push(`Asset equipment health is degraded (${healthScore}%).`);
  if (partsAvail < 70) reasons.push(`Critical replacement component availability is low (${partsAvail}%).`);
  if (supplierRisk > 45) reasons.push(`Upstream supplier risk score is elevated (${supplierRisk}/100).`);
  if (maintStatus < 70) reasons.push(`Maintenance inspection is due or overdue (${maintStatus}% completion index).`);
  if (capacity < 70) reasons.push(`Depot maintenance workload capacity is constrained (${capacity}%).`);

  if (reasons.length === 0) {
    reasons.push('All readiness vectors operating within optimal performance envelopes.');
  }

  let aiRecommendation = '';
  if (readinessScore < 70) {
    aiRecommendation = `Prioritize inspection for ${asset.id} and expedite critical component allocation. Verify alternate tier-1 supplier lead times.`;
  } else if (readinessScore < 85) {
    aiRecommendation = `Schedule preventive maintenance window for ${asset.id} within 10 days to prevent readiness regression.`;
  } else {
    aiRecommendation = `Maintain routine monitoring schedule for ${asset.id}. No immediate intervention required.`;
  }

  return {
    readinessScore,
    status,
    factors: {
      healthScore,
      partsAvailability: partsAvail,
      maintenanceStatus: maintStatus,
      supplierResilience,
      maintenanceCapacity: capacity
    },
    reasons,
    aiRecommendation
  };
}

/**
 * Calculates fleet-wide KPIs from array of processed assets
 */
function calculateFleetKpis(assets) {
  const totalAssets = assets.length;
  const operational = assets.filter(a => a.status === 'OPERATIONAL').length;
  const underMaintenance = assets.filter(a => a.status === 'UNDER_MAINTENANCE').length;
  const atRisk = assets.filter(a => a.status === 'AT_RISK').length;

  const avgReadiness = Math.round(
    assets.reduce((sum, a) => sum + a.readinessScore, 0) / (totalAssets || 1)
  );

  const criticalPartsCount = assets.filter(a => a.partsAvailability < 65).length;
  const supplierRisksCount = assets.filter(a => a.supplierRiskScore > 50).length;

  return {
    totalAssets,
    operational,
    underMaintenance,
    atRisk,
    criticalParts: criticalPartsCount,
    supplierRisks: supplierRisksCount,
    overallReadiness: avgReadiness
  };
}

module.exports = {
  DEFAULT_WEIGHTS,
  calculateAssetReadiness,
  calculateFleetKpis
};
