const express = require('express');
const router = express.Router();

// GET inventory records
router.get('/', (req, res) => {
  const { inventory, components, suppliers } = req.app.locals;
  const { status, criticality, search } = req.query;

  let enriched = inventory.map(item => {
    const comp = components.find(c => c.id === item.partId);
    const supplier = comp ? suppliers.find(s => s.id === comp.supplierId) : null;

    return {
      ...item,
      category: comp ? comp.category : 'General Spare',
      criticality: comp ? comp.criticality : 'MEDIUM',
      supplierId: supplier ? supplier.id : 'SUP-101',
      unitCostUSD: comp ? comp.unitCostUSD : 15000
    };
  });

  if (status && status !== 'ALL') {
    enriched = enriched.filter(i => i.status === status);
  }

  if (criticality && criticality !== 'ALL') {
    enriched = enriched.filter(i => i.criticality === criticality);
  }

  if (search) {
    const q = search.toLowerCase();
    enriched = enriched.filter(i => i.partName.toLowerCase().includes(q) || i.partId.toLowerCase().includes(q) || i.supplierName.toLowerCase().includes(q));
  }

  res.json({
    success: true,
    count: enriched.length,
    data: enriched
  });
});

module.exports = router;
