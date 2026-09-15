const express = require('express');
const router = express.Router();

// GET supply chain node network graph
router.get('/', (req, res) => {
  const { supplyChainNodes, assets, suppliers, components } = req.app.locals;

  // Build high-impact node dependencies graph
  const nodes = supplyChainNodes;
  const links = [
    { source: 'node-sup-1', target: 'node-comp-1', label: 'Supplies Blades' },
    { source: 'node-sup-2', target: 'node-comp-2', label: 'Supplies Logic Board' },
    { source: 'node-sup-3', target: 'node-comp-3', label: 'Supplies Actuators' },
    { source: 'node-comp-1', target: 'node-wh-1', label: 'Dispatched To' },
    { source: 'node-comp-2', target: 'node-wh-1', label: 'Dispatched To' },
    { source: 'node-comp-3', target: 'node-wh-2', label: 'Dispatched To' },
    { source: 'node-wh-1', target: 'node-maint-1', label: 'Staged At' },
    { source: 'node-wh-2', target: 'node-maint-2', label: 'Staged At' },
    { source: 'node-maint-1', target: 'node-asset-1', label: 'Services Asset' },
    { source: 'node-maint-2', target: 'node-asset-7', label: 'Services Asset' }
  ];

  res.json({
    success: true,
    data: {
      nodes,
      links,
      impactAnalysisSummary: {
        detectedBottleneck: 'Supplier Beta lead time extended to 37 days.',
        potentiallyAffectedComponents: 12,
        potentiallyAffectedAssets: 7,
        affectedMaintenanceSchedules: 3
      }
    }
  });
});

module.exports = router;
