const express = require('express');
const router = express.Router();
const { runSimulation } = require('../services/simulatorEngine');

// POST trigger dynamic What-If resilience simulation
router.post('/', (req, res) => {
  const { assets, suppliers, components } = req.app.locals;
  const {
    supplierDelayDays = 0,
    materialShortageCategory = 'NONE',
    workforceCapacityPercent = 100,
    transportDisruptionLevel = 'LOW',
    weights
  } = req.body;

  const result = runSimulation(assets, suppliers, components, {
    supplierDelayDays: Number(supplierDelayDays),
    materialShortageCategory,
    workforceCapacityPercent: Number(workforceCapacityPercent),
    transportDisruptionLevel,
    weights
  });

  res.json({
    success: true,
    data: result
  });
});

module.exports = router;
