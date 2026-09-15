const express = require('express');
const router = express.Router();

// GET alert center records
router.get('/', (req, res) => {
  const { alerts } = req.app.locals;
  const { severity } = req.query;

  let filtered = [...alerts];
  if (severity && severity !== 'ALL') {
    filtered = filtered.filter(a => a.severity === severity);
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

module.exports = router;
