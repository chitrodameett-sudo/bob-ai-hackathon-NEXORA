// AEROVIGIL - Centralized Defense & Aerospace Equipment Master Dataset
// Dynamic counts: 1,248 total equipment across 6 categories

const categories = [
  { name: 'Aircraft', count: 320, prefix: 'AF', types: ['Tactical Jet', 'Recon Stealth Air', 'Heavy Lift Transport', 'Attack Helicopter'] },
  { name: 'Armored Vehicles', count: 285, prefix: 'AV', types: ['Main Battle Tank', 'Armored Personnel Carrier', 'Infantry Fighting Vehicle', 'Armored Recon'] },
  { name: 'Ground Vehicles', count: 410, prefix: 'GV', types: ['Tactical Logistics Truck', 'Mobile Command Rover', 'Heavy Fuel Transport', 'All-Terrain Recon'] },
  { name: 'Air Defense', count: 96, prefix: 'AD', types: ['Phased Radar Array', 'Mobile SAM Launcher', 'Counter-Drone Battery', 'Early Warning Sensor'] },
  { name: 'Naval Systems', count: 72, prefix: 'NV', types: ['Patrol Frigate', 'Littoral Combat Unit', 'Submarine Recon Drone', 'Unmanned Sea Vessel'] },
  { name: 'Support Systems', count: 65, prefix: 'SS', types: ['Tactical Power Generator', 'Mobile Repair Workshop', 'Field Communications Unit', 'Decontamination Rig'] }
];

const componentTemplates = {
  'Aircraft': [
    { id: 'engine', name: 'Power & Propulsion Turbine', problemLocation: 'rear_engine_section' },
    { id: 'cooling', name: 'Thermal Cooling System', problemLocation: 'cooling_subsystem' },
    { id: 'electrical', name: 'Power Distribution Unit', problemLocation: 'electrical_bus' },
    { id: 'avionics', name: 'Avionics Logic Module', problemLocation: 'cockpit_avionics' },
    { id: 'sensors', name: 'Radar Transceiver Array', problemLocation: 'nose_radome' },
    { id: 'hydraulics', name: 'Hydraulic Actuators', problemLocation: 'wing_actuators' },
    { id: 'structure', name: 'Composite Airframe Matrix', problemLocation: 'wing_spar' }
  ],
  'Armored Vehicles': [
    { id: 'engine', name: 'Heavy Diesel Engine', problemLocation: 'rear_engine_section' },
    { id: 'transmission', name: 'Powertrain Transmission', problemLocation: 'drivetrain_center' },
    { id: 'cooling', name: 'Engine Radiator & Cooling', problemLocation: 'cooling_subsystem' },
    { id: 'electrical', name: 'Auxiliary Power Battery', problemLocation: 'electrical_bus' },
    { id: 'suspension', name: 'Hydropneumatic Track System', problemLocation: 'track_assembly' },
    { id: 'hydraulics', name: 'Turret Traverse Hydraulics', problemLocation: 'turret_assembly' },
    { id: 'structure', name: 'Composite Armor Hull', problemLocation: 'hull_structure' }
  ],
  'Ground Vehicles': [
    { id: 'engine', name: 'Turbo Diesel Powertrain', problemLocation: 'engine_bay' },
    { id: 'transmission', name: 'AWD Gearbox', problemLocation: 'transmission_box' },
    { id: 'battery', name: 'Heavy Duty Power Cell', problemLocation: 'battery_tray' },
    { id: 'braking', name: 'Pneumatic Braking System', problemLocation: 'brake_lines' },
    { id: 'cooling', name: 'Radiator Cooling Matrix', problemLocation: 'cooling_subsystem' },
    { id: 'electrical', name: 'Vehicle Harness & Logic', problemLocation: 'electrical_bus' }
  ],
  'Air Defense': [
    { id: 'power', name: 'High-Output Generator', problemLocation: 'power_generator' },
    { id: 'sensors', name: 'Phased Radar Transceivers', problemLocation: 'radar_array' },
    { id: 'communication', name: 'Tactical Data Link Antenna', problemLocation: 'antenna_mast' },
    { id: 'cooling', name: 'Liquid Chiller Unit', problemLocation: 'chiller_unit' },
    { id: 'electrical', name: 'Signal Processing Rack', problemLocation: 'processing_rack' }
  ],
  'Naval Systems': [
    { id: 'engine', name: 'Turbine Marine Engine', problemLocation: 'propulsion_shaft' },
    { id: 'power', name: 'Main Power Plant', problemLocation: 'generator_room' },
    { id: 'navigation', name: 'Navigational Sonar Array', problemLocation: 'bow_sonar' },
    { id: 'cooling', name: 'Seawater Cooling Pump', problemLocation: 'cooling_subsystem' },
    { id: 'electrical', name: 'Power Bus Controller', problemLocation: 'electrical_bus' },
    { id: 'structure', name: 'Reinforced Hull Matrix', problemLocation: 'hull_structure' }
  ],
  'Support Systems': [
    { id: 'power', name: 'Diesel Generator Core', problemLocation: 'generator_core' },
    { id: 'cooling', name: 'Thermal Management Fan', problemLocation: 'cooling_subsystem' },
    { id: 'control', name: 'Microprocessor Control Board', problemLocation: 'control_panel' },
    { id: 'fuel', name: 'Fuel Delivery Pump', problemLocation: 'fuel_pump' }
  ]
};

// Generate full equipment dataset
let globalEquipmentList = [];
let idCounter = 1;

categories.forEach(cat => {
  const templates = componentTemplates[cat.name] || componentTemplates['Aircraft'];

  for (let i = 1; i <= cat.count; i++) {
    const numStr = i.toString().padStart(3, '0');
    const id = `${cat.prefix}-${numStr}`;
    const type = cat.types[(i - 1) % cat.types.length];
    const name = `${cat.name.split(' ')[0]}-${type.split(' ')[0]}-${numStr}`;

    // Determine health distribution
    // ~78% Ready, ~14% Limited, ~5% Maintenance, ~3% Critical
    const dice = (i * 13 + idCounter * 7) % 100;
    
    let baseHealth = 92;
    let baseReadiness = 90;
    let status = 'READY';

    if (dice < 4) {
      status = 'CRITICAL';
      baseHealth = Math.floor(40 + (i % 18));
      baseReadiness = Math.floor(35 + (i % 16));
    } else if (dice < 10) {
      status = 'MAINTENANCE';
      baseHealth = Math.floor(60 + (i % 15));
      baseReadiness = Math.floor(55 + (i % 15));
    } else if (dice < 22) {
      status = 'LIMITED';
      baseHealth = Math.floor(70 + (i % 14));
      baseReadiness = Math.floor(66 + (i % 12));
    } else {
      status = 'READY';
      baseHealth = Math.floor(88 + (i % 12));
      baseReadiness = Math.floor(85 + (i % 14));
    }

    // Build components list
    const components = templates.map((tmpl, tIdx) => {
      let cHealth = Math.min(100, Math.max(30, baseHealth + ((tIdx % 3) - 1) * 6));
      let cStatus = 'HEALTHY';
      let problem = null;

      // Inject problem for Degraded/Critical assets
      if ((status === 'CRITICAL' || status === 'LIMITED' || status === 'MAINTENANCE') && tIdx === 1) {
        cHealth = status === 'CRITICAL' ? 38 : status === 'MAINTENANCE' ? 54 : 64;
        cStatus = status === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
        problem = `${tmpl.name} operating temperature above normal safety threshold.`;
      }

      return {
        id: tmpl.id,
        name: tmpl.name,
        health: cHealth,
        status: cStatus,
        temperature: Math.round(55 + (cHealth < 60 ? 32 : 12)),
        vibration: parseFloat((0.8 + (cHealth < 60 ? 1.8 : 0.4)).toFixed(2)),
        problem,
        problemLocation: tmpl.problemLocation,
        impact: cHealth < 60 ? 'High readiness drop. Inspection required.' : 'Minor telemetry variance.'
      };
    });

    // Determine primary critical component & problem
    const problemComp = components.find(c => c.health < 70) || components[0];
    const problemCount = components.filter(c => c.health < 75).length;

    globalEquipmentList.push({
      id,
      name,
      category: cat.name,
      type,
      health: baseHealth,
      readiness: baseReadiness,
      status,
      lastCheck: `${(i % 15) + 1} min ago`,
      nextMaintenance: `${(i % 25) + 2} days`,
      problemCount,
      criticalComponent: problemComp.name,
      problemLocation: problemComp.problemLocation,
      problemDetails: problemComp.problem,
      overallRisk: status === 'CRITICAL' ? 'HIGH' : status === 'LIMITED' ? 'MEDIUM' : 'LOW',
      components
    });

    idCounter++;
  }
});

const initialSuppliers = Array.from({ length: 20 }, (_, i) => ({
  id: `SUP-${(101 + i).toString()}`,
  name: ['Titanium Defense Alloys', 'Apex Avionics Systems', 'HydroTech Precision', 'Global Composite Materials', 'MicroSemicon Defense'][i % 5],
  region: ['North America', 'Europe', 'Asia-Pacific', 'Middle East'][i % 4],
  reliability: 60 + (i * 7) % 35,
  averageLeadTimeDays: 12 + (i * 5) % 30,
  inventoryAvailability: 30 + (i * 9) % 65,
  riskScore: 20 + (i * 13) % 65,
  riskLevel: i % 3 === 0 ? 'HIGH' : i % 2 === 0 ? 'MEDIUM' : 'LOW',
  suppliedCategory: ['Avionics', 'Composites', 'Hydraulics', 'Propulsion', 'Semiconductors'][i % 5],
  aiNotes: 'Lead time monitoring active.'
}));

const initialInventory = globalEquipmentList.slice(0, 50).map((e, idx) => ({
  partId: `PART-${101 + idx}`,
  partName: `${e.criticalComponent} Gen-${(idx % 3) + 1}`,
  stock: Math.floor(2 + (idx * 3) % 15),
  required: Math.floor(10 + (idx * 2) % 20),
  leadTimeDays: 14 + (idx * 4) % 25,
  supplierName: 'Titanium Defense Alloys',
  supplierRisk: idx % 3 === 0 ? 'HIGH' : 'LOW',
  status: (idx * 3) % 15 < 5 ? 'SHORTAGE' : 'ADEQUATE',
  category: e.category
}));

const initialAlerts = globalEquipmentList.filter(e => e.status === 'CRITICAL' || e.status === 'LIMITED').slice(0, 25).map((e, idx) => ({
  id: `ALT-${500 + idx}`,
  equipmentId: e.id,
  equipmentName: e.name,
  severity: e.status === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
  title: `${e.category} Equipment Alert: ${e.id}`,
  message: `${e.name} (${e.id}) readiness degraded to ${e.readiness}%. Problem detected in ${e.criticalComponent}.`,
  timestamp: new Date(Date.now() - (idx * 1800000)).toISOString(),
  resolved: false
}));

module.exports = {
  categories,
  globalEquipmentList,
  initialSuppliers,
  initialInventory,
  initialAlerts
};
