const express = require('express');
const router = express.Router();

// GET supplier risk intelligence records
router.get('/', (req, res) => {
  const { suppliers } = req.app.locals;
  const { riskLevel, region, search } = req.query;

  let filtered = [...suppliers];

  if (riskLevel && riskLevel !== 'ALL') {
    filtered = filtered.filter(s => s.riskLevel === riskLevel);
  }

  if (region && region !== 'ALL') {
    filtered = filtered.filter(s => s.region.toLowerCase().includes(region.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.suppliedCategory.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

module.exports = router;
