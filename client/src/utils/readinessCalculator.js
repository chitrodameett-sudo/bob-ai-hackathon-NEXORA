// AEROVIGIL Client-side Readiness Formula Calculator

export function calculateReadiness(asset, weights = { health: 0.35, parts: 0.25, maintenance: 0.15, supplier: 0.15, capacity: 0.10 }) {
  const health = asset.healthScore || 80;
  const parts = asset.partsAvailability || 80;
  const maint = asset.maintenanceStatus || 80;
  const supplierResilience = Math.max(0, 100 - (asset.supplierRiskScore || 20));
  const capacity = asset.maintenanceCapacity || 80;

  const score = Math.round(
    (health * weights.health) +
    (parts * weights.parts) +
    (maint * weights.maintenance) +
    (supplierResilience * weights.supplier) +
    (capacity * weights.capacity)
  );

  let status = 'OPERATIONAL';
  if (score < 70) status = 'AT_RISK';
  else if (score < 85) status = 'UNDER_MAINTENANCE';

  return { score, status };
}

export function getStatusColor(statusOrScore) {
  if (typeof statusOrScore === 'number') {
    if (statusOrScore >= 85) return 'emerald';
    if (statusOrScore >= 70) return 'amber';
    return 'rose';
  }

  switch (statusOrScore) {
    case 'OPERATIONAL':
    case 'HEALTHY':
    case 'ADEQUATE':
    case 'LOW':
    case 'NORMAL':
      return 'emerald';
    case 'UNDER_MAINTENANCE':
    case 'WARNING':
    case 'MEDIUM':
    case 'WATCH':
      return 'amber';
    case 'AT_RISK':
    case 'CRITICAL':
    case 'HIGH':
    case 'SHORTAGE':
      return 'rose';
    default:
      return 'cyan';
  }
}
