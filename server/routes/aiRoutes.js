const express = require('express');
const router = express.Router();
const { analyzeAssetRisk, processAiChat } = require('../services/aiEngine');

// POST AI asset risk analysis ("WHY IS THIS ASSET AT RISK?")
router.post('/analyze', (req, res) => {
  const { assetId } = req.body;
  const { assets, suppliers, components } = req.app.locals;

  const asset = assets.find(a => a.id.toUpperCase() === (assetId || '').toUpperCase()) || assets[0];
  const supplier = suppliers.find(s => s.id === asset.criticalSupplierId);
  const component = components.find(c => c.id === asset.criticalPartId);

  const analysis = analyzeAssetRisk(asset, supplier, component);

  res.json({
    success: true,
    data: analysis
  });
});

// POST AI Chat assistant (AERO AI)
router.post('/chat', (req, res) => {
  const { query } = req.body;
  const { assets, suppliers, components, maintenance } = req.app.locals;

  const response = processAiChat(query, {
    assets,
    suppliers,
    components,
    maintenance
  });

  res.json({
    success: true,
    data: response
  });
});

module.exports = router;
