const express = require('express');
const router = express.Router();

// GET predictive maintenance queue sorted by smart priority engine
router.get('/', (req, res) => {
  const { maintenance, assets, components, suppliers } = req.app.locals;
  const { priority, search, sortBy } = req.query;

  let enriched = maintenance.map(m => {
    const asset = assets.find(a => a.id === m.assetId);
    const comp = components.find(c => c.id === m.componentId);
    const supplier = comp ? suppliers.find(s => s.id === comp.supplierId) : null;

    // Calculate Smart Priority Score: Failure Risk (40%) + Component Shortage (30%) + Supplier Risk (30%)
    const shortageScore = comp && comp.status === 'SHORTAGE' ? 90 : 30;
    const supplierRiskScore = supplier ? supplier.riskScore : 40;
    const smartPriorityScore = Math.round(
      (m.failureRiskPercent * 0.40) +
      (shortageScore * 0.30) +
      (supplierRiskScore * 0.30)
    );

    const calculatedPriority = smartPriorityScore > 70 ? 'CRITICAL' : smartPriorityScore > 50 ? 'HIGH' : 'MEDIUM';

    return {
      ...m,
      smartPriorityScore,
      priority: calculatedPriority,
      componentStock: comp ? comp.stock : 0,
      partAvailabilityStatus: comp ? comp.status : 'ADEQUATE',
      supplierRiskLevel: supplier ? supplier.riskLevel : 'LOW',
      assetReadinessScore: asset ? asset.readinessScore : 80
    };
  });

  if (priority && priority !== 'ALL') {
    enriched = enriched.filter(m => m.priority === priority);
  }

  if (search) {
    const q = search.toLowerCase();
    enriched = enriched.filter(m => 
      m.assetName.toLowerCase().includes(q) || 
      m.componentName.toLowerCase().includes(q) || 
      m.assetId.toLowerCase().includes(q)
    );
  }

  // Sort by smart priority score descending by default
  enriched.sort((a, b) => b.smartPriorityScore - a.smartPriorityScore);

  res.json({
    success: true,
    count: enriched.length,
    data: enriched
  });
});

module.exports = router;
