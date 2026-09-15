const express = require('express');
const router = express.Router();

// GET Equipment Summary Counts (Dynamic totals per category & status)
router.get('/summary', (req, res) => {
  const { assets } = req.app.locals;

  const total = assets.length;
  const ready = assets.filter(a => a.status === 'READY').length;
  const limited = assets.filter(a => a.status === 'LIMITED').length;
  const underMaintenance = assets.filter(a => a.status === 'MAINTENANCE').length;
  const critical = assets.filter(a => a.status === 'CRITICAL').length;

  const categoriesCount = {
    'ALL EQUIPMENT': total,
    'AIRCRAFT': assets.filter(a => a.category === 'Aircraft').length,
    'ARMORED VEHICLES': assets.filter(a => a.category === 'Armored Vehicles').length,
    'GROUND VEHICLES': assets.filter(a => a.category === 'Ground Vehicles').length,
    'AIR DEFENSE': assets.filter(a => a.category === 'Air Defense').length,
    'NAVAL SYSTEMS': assets.filter(a => a.category === 'Naval Systems').length,
    'SUPPORT SYSTEMS': assets.filter(a => a.category === 'Support Systems').length
  };

  const avgReadiness = Math.round(assets.reduce((sum, a) => sum + a.readiness, 0) / (total || 1));

  res.json({
    success: true,
    summary: {
      total,
      ready,
      limited,
      underMaintenance,
      critical,
      overallReadiness: avgReadiness
    },
    categories: categoriesCount
  });
});

// GET All Equipment with filtering & pagination
router.get('/', (req, res) => {
  const { assets } = req.app.locals;
  const { category, status, search, sortBy, sortOrder = 'asc', page = 1, limit = 50 } = req.query;

  let filtered = [...assets];

  if (category && category !== 'ALL' && category !== 'ALL EQUIPMENT') {
    filtered = filtered.filter(a => a.category.toUpperCase() === category.toUpperCase());
  }

  if (status && status !== 'ALL') {
    filtered = filtered.filter(a => a.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a => 
      a.id.toLowerCase().includes(q) || 
      a.name.toLowerCase().includes(q) || 
      a.type.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const p = parseInt(page, 10);
  const l = parseInt(limit, 10);
  const startIndex = (p - 1) * l;
  const paginatedData = filtered.slice(startIndex, startIndex + l);

  res.json({
    success: true,
    count: filtered.length,
    total: assets.length,
    page: p,
    totalPages: Math.ceil(filtered.length / l),
    data: paginatedData
  });
});

// GET Single Equipment Detail by ID
router.get('/:id', (req, res) => {
  const { assets } = req.app.locals;
  const equipment = assets.find(a => a.id.toUpperCase() === req.params.id.toUpperCase());

  if (!equipment) {
    return res.status(404).json({ success: false, message: `Equipment ${req.params.id} not found.` });
  }

  // Find degraded component with problem location
  const problemComponent = equipment.components.find(c => c.health < 70) || equipment.components[0];

  res.json({
    success: true,
    data: {
      ...equipment,
      problemComponent,
      aiExplanation: equipment.readiness < 70
        ? `${equipment.id} health is degraded (${equipment.health}%) due to low component health in ${problemComponent.name} (${problemComponent.health}%). ${problemComponent.problem || 'Inspection recommended.'}`
        : `${equipment.id} operational metrics meet baseline readiness standards. Subsystems nominal.`
    }
  });
});

// POST Trigger Live Health Check Scan
router.post('/live-health-check', (req, res) => {
  const { assets } = req.app.locals;
  
  // Slightly adjust telemetry values to simulate live scanning
  assets.forEach(a => {
    a.components.forEach(c => {
      c.temperature = Math.max(30, Math.min(110, c.temperature + (Math.floor(Math.random() * 3) - 1)));
      c.vibration = parseFloat(Math.max(0.2, c.vibration + (Math.random() * 0.1 - 0.05)).toFixed(2));
    });
    a.lastCheck = 'Just now';
  });

  res.json({
    success: true,
    message: '✓ LIVE HEALTH CHECK COMPLETE',
    lastChecked: new Date().toLocaleTimeString(),
    scannedCount: assets.length
  });
});

module.exports = router;
