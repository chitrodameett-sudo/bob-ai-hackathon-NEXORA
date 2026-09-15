// NEXORA - AI Reasoning & Natural Language Assistant Engine

function analyzeAssetRisk(asset, supplier, component) {
  const reasons = [];

  if (asset.health < 75) {
    reasons.push({
      factor: 'Equipment Health',
      severity: 'HIGH',
      description: `Primary subsystem health degraded to ${asset.health}%.`
    });
  }

  if (component && component.status === 'CRITICAL') {
    reasons.push({
      factor: 'Critical Component Problem',
      severity: 'CRITICAL',
      description: `${component.name} health is ${component.health}%. ${component.problem || 'Inspection recommended.'}`
    });
  }

  const recommendation = asset.readiness < 70
    ? `Prioritize inspection of ${asset.id} (${asset.name}) and verify immediate allocation of replacement sub-assembly for ${component ? component.name : 'subsystem'}.`
    : `Schedule routine maintenance during next designated window.`;

  return {
    assetId: asset.id,
    readinessScore: asset.readiness,
    status: asset.status,
    reasons,
    aiRecommendation: recommendation
  };
}

function processAiChat(userQuery, fleetContext) {
  const queryLower = (userQuery || '').toLowerCase();
  const { assets = [] } = fleetContext;

  if (queryLower.includes('first') || queryLower.includes('highest priority') || queryLower.includes('needs maintenance')) {
    return {
      reply: `**NEXORA AI Maintenance Recommendation:**\n\n` +
             `• **AF-002 (Falcon-A2)** is the highest priority because its Cooling System health is **41%**, overall readiness is **51%**, and the maintenance threshold has been exceeded.\n` +
             `• **AV-002 (Armored-X2)** is second priority with a transmission drivetrain anomaly (48% health).\n` +
             `• **GV-002 (Logistics-X2)** requires electrical harness inspection.`,
      suggestedActions: ["View All Equipment", "Launch Live Health Check"]
    };
  }

  if (queryLower.includes('why') && (queryLower.includes('not ready') || queryLower.includes('af-002'))) {
    return {
      reply: `**Analysis for AF-002 (Falcon-A2):**\n\n` +
             `• **Overall Equipment Health:** 68%\n` +
             `• **Overall Readiness:** 51% (NOT READY)\n` +
             `• **Primary Problem:** Cooling System health is critically low (**41%**).\n\n` +
             `**NEXORA AI Diagnosis:** Equipment health is 68%, but readiness is reduced to 51% because the Cooling System requires immediate technician inspection and component overhaul.`,
      suggestedActions: ["Inspect AF-002 in 3D Twin", "Open Alert Center"]
    };
  }

  return {
    reply: `NEXORA AI Equipment Readiness Intelligence active. Monitoring 1,248 defense assets across Aircraft, Armored Vehicles, Ground Vehicles, Air Defense, Naval, and Support Systems.\n\n` +
           `You can ask me:\n` +
           `• *"Which equipment needs maintenance first?"*\n` +
           `• *"Why is AF-002 not ready?"*\n` +
           `• *"Which parts have the highest shortage risk?"*`,
    suggestedActions: ["Launch Command Center", "View All Equipment", "Open 3D Digital Twin"]
  };
}

module.exports = {
  analyzeAssetRisk,
  processAiChat
};
