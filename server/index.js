const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
  categories,
  globalEquipmentList,
  initialSuppliers,
  initialInventory,
  initialAlerts
} = require('./data/seedData');

const { calculateAssetReadiness, calculateFleetKpis, DEFAULT_WEIGHTS } = require('./services/readinessEngine');

const assetRoutes = require('./routes/assetRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const supplyChainRoutes = require('./routes/supplyChainRoutes');
const alertRoutes = require('./routes/alertRoutes');
const intelligenceRoutes = require('./routes/intelligenceRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.locals.assets = JSON.parse(JSON.stringify(globalEquipmentList));
app.locals.suppliers = JSON.parse(JSON.stringify(initialSuppliers));
app.locals.components = app.locals.assets.flatMap(a => a.components);
app.locals.inventory = JSON.parse(JSON.stringify(initialInventory));
app.locals.maintenance = app.locals.assets.filter(a => a.status === 'CRITICAL' || a.status === 'MAINTENANCE').slice(0, 50).map((a, i) => ({
  id: `MAINT-${1001 + i}`,
  assetId: a.id,
  assetName: a.name,
  componentId: a.components[0].id,
  componentName: a.components[0].name,
  currentHealthScore: a.health,
  failureRiskPercent: 100 - a.health,
  expectedMaintenanceWindow: a.nextMaintenance,
  priority: a.status === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
  status: 'PENDING',
  recommendedAction: `Inspect ${a.components[0].name} subsystem immediately.`
}));
app.locals.alerts = JSON.parse(JSON.stringify(initialAlerts));
app.locals.supplyChainNodes = [
  { id: 'node-sup-1', label: 'Supplier Alpha (Titanium Alloys)', type: 'SUPPLIER', region: 'North America', status: 'HEALTHY', risk: 'LOW' },
  { id: 'node-sup-2', label: 'Supplier Beta (Apex Avionics)', type: 'SUPPLIER', region: 'Europe', status: 'WARNING', risk: 'HIGH' },
  { id: 'node-comp-1', label: 'Cooling Subsystem Matrix', type: 'COMPONENT', status: 'SHORTAGE' },
  { id: 'node-asset-1', label: 'AF-002 (Falcon-A2 Aircraft)', type: 'ASSET', readiness: 52 }
];
app.locals.weights = { ...DEFAULT_WEIGHTS };

app.use('/api/assets', assetRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/supply-chain', supplyChainRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/dashboard', (req, res) => {
  const { assets, alerts } = app.locals;

  const total = assets.length;
  const ready = assets.filter(a => a.status === 'READY').length;
  const limited = assets.filter(a => a.status === 'LIMITED').length;
  const underMaintenance = assets.filter(a => a.status === 'MAINTENANCE').length;
  const critical = assets.filter(a => a.status === 'CRITICAL').length;
  const overallReadiness = Math.round(assets.reduce((sum, a) => sum + a.readiness, 0) / (total || 1));

  const categoryCards = [
    { category: 'AIRCRAFT', count: assets.filter(a => a.category === 'Aircraft').length, readiness: Math.round(assets.filter(a => a.category === 'Aircraft').reduce((s, a) => s + a.readiness, 0) / 320) },
    { category: 'ARMORED VEHICLES', count: assets.filter(a => a.category === 'Armored Vehicles').length, readiness: Math.round(assets.filter(a => a.category === 'Armored Vehicles').reduce((s, a) => s + a.readiness, 0) / 285) },
    { category: 'GROUND VEHICLES', count: assets.filter(a => a.category === 'Ground Vehicles').length, readiness: Math.round(assets.filter(a => a.category === 'Ground Vehicles').reduce((s, a) => s + a.readiness, 0) / 410) },
    { category: 'AIR DEFENSE', count: assets.filter(a => a.category === 'Air Defense').length, readiness: Math.round(assets.filter(a => a.category === 'Air Defense').reduce((s, a) => s + a.readiness, 0) / 96) },
    { category: 'NAVAL SYSTEMS', count: assets.filter(a => a.category === 'Naval Systems').length, readiness: Math.round(assets.filter(a => a.category === 'Naval Systems').reduce((s, a) => s + a.readiness, 0) / 72) },
    { category: 'SUPPORT SYSTEMS', count: assets.filter(a => a.category === 'Support Systems').length, readiness: Math.round(assets.filter(a => a.category === 'Support Systems').reduce((s, a) => s + a.readiness, 0) / 65) }
  ];

  const criticalEquipment = assets.filter(a => a.status === 'CRITICAL' || a.status === 'LIMITED').slice(0, 6);

  res.json({
    success: true,
    demoMode: true,
    systemStatus: 'ONLINE',
    timestamp: new Date().toISOString(),
    kpis: {
      totalAssets: total,
      ready,
      limited,
      underMaintenance,
      critical,
      overallReadiness
    },
    categoryCards,
    criticalEquipment,
    alerts: alerts.slice(0, 5)
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    platform: 'NEXORA Equipment Readiness Monitoring',
    version: '2.0.0-hackathon',
    demoMode: true
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` NEXORA Equipment Readiness Server Running on Port ${PORT}`);
  console.log(` Mode: DEMO TELEMETRY (1,248 Equipment Monitored)`);
  console.log(`=======================================================`);
});
