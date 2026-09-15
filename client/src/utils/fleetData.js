// NEXORA — Fleet Data Generator
// Generates 1,248 simulated equipment entries for the Live Health Check system.
// DEMO / SIMULATION MODE — All data is fictional for hackathon prototype.
//
// STATUS MODEL (3 states only):
//   READY       — Healthy, operational, no maintenance urgency
//   MAINTENANCE — Needs scheduled/urgent maintenance but not critically down
//   CRITICAL    — Not ready; severe component failure or critically low readiness

const CATEGORIES = [
  {
    key: 'Aircraft',
    prefix: 'AF',
    count: 320,
    names: ['Falcon', 'Raptor', 'Eagle', 'Hawk', 'Thunderbolt', 'Viper', 'Phoenix', 'Storm'],
    components: ['Engine Turbine', 'Cooling System', 'Avionics Suite', 'Hydraulic Actuators', 'Electrical Bus', 'Structural Airframe', 'Fuel System', 'Navigation'],
  },
  {
    key: 'Armored Vehicles',
    prefix: 'AV',
    count: 285,
    names: ['Armored-X', 'Titan', 'Rhino', 'Grizzly', 'Iron-Wolf', 'Cerberus', 'Kodiak', 'Paladin'],
    components: ['Engine Block', 'Transmission', 'Track Assembly', 'Turret Hydraulics', 'Armor Integrity', 'Electrical System', 'Crew Systems', 'Fire Control'],
  },
  {
    key: 'Ground Vehicles',
    prefix: 'GV',
    count: 410,
    names: ['Logistics-X', 'Carrier', 'Hauler', 'Convoy', 'Scout', 'Striker', 'Atlas', 'Lynx'],
    components: ['Engine', 'Drivetrain', 'Suspension', 'Electrical Harness', 'Brake System', 'Fuel System', 'Communications', 'Navigation'],
  },
  {
    key: 'Air Defense',
    prefix: 'AD',
    count: 96,
    names: ['Sentinel', 'Aegis', 'Patriot-X', 'Defender', 'Archer', 'Guardian', 'Bastion', 'Rampart'],
    components: ['Radar Array', 'Tracking System', 'Launcher Mechanism', 'Power Unit', 'Communications', 'Fire Control', 'Structural', 'Cooling'],
  },
  {
    key: 'Naval Systems',
    prefix: 'NV',
    count: 72,
    names: ['Corsair', 'Triton', 'Poseidon', 'Leviathan', 'Mariner', 'Tempest', 'Neptune', 'Orca'],
    components: ['Propulsion', 'Hull Integrity', 'Navigation', 'Weapons System', 'Radar', 'Engine Room', 'Electrical', 'Communications'],
  },
  {
    key: 'Support Systems',
    prefix: 'SS',
    count: 65,
    names: ['Generator-X', 'Power-Unit', 'Field-Hub', 'Relay-Node', 'Comms-Base', 'Supply-Rig', 'Base-Alpha', 'Command-Post'],
    components: ['Power Generator', 'Cooling Unit', 'Control Systems', 'Fuel Supply', 'Electrical', 'Communications', 'Structural', 'Safety Systems'],
  },
];

const PROBLEMS = {
  'Engine Turbine': 'Turbine blade stress fractures detected',
  'Cooling System': 'Temperature above safety threshold',
  'Avionics Suite': 'Signal loss on secondary avionics bus',
  'Hydraulic Actuators': 'Pressure variance detected in primary actuators',
  'Electrical Bus': 'Voltage instability on power distribution rail',
  'Structural Airframe': 'Micro-fracture detected in wing spar section',
  'Fuel System': 'Fuel flow rate below operational threshold',
  'Navigation': 'GPS signal lock degraded, INS drift detected',
  'Engine Block': 'Oil pressure below nominal range',
  'Transmission': 'Gear shift anomaly in 3rd-4th transition',
  'Track Assembly': 'Track tension variance, pin wear detected',
  'Turret Hydraulics': 'Hydraulic fluid leak in traverse mechanism',
  'Armor Integrity': 'Surface delamination detected in composite panel',
  'Fire Control': 'Fire control computer checksum error',
  'Engine': 'Coolant temperature elevated, thermostat suspect',
  'Drivetrain': 'Differential bearing wear above threshold',
  'Suspension': 'Shock absorber pressure loss, right rear assembly',
  'Electrical Harness': 'Insulation breach in high-voltage harness',
  'Brake System': 'Brake pad wear 15% remaining',
  'Radar Array': 'Radar return signal strength degraded 22%',
  'Tracking System': 'Target acquisition delay beyond spec',
  'Launcher Mechanism': 'Launcher rail alignment drift detected',
  'Power Unit': 'Output voltage fluctuation ±8V',
  'Propulsion': 'Shaft vibration frequency anomaly detected',
  'Hull Integrity': 'Ballast tank seal wear detected',
  'Weapons System': 'Loading mechanism timing drift',
  'Power Generator': 'Generator output stability variance detected',
  'Cooling Unit': 'Refrigerant pressure low, compressor load high',
  'Control Systems': 'Control board firmware checksum mismatch',
};

// Seeded pseudo-random for deterministic generation
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * Determine status from health + readiness + component condition.
 * THREE states only: READY | MAINTENANCE | CRITICAL
 *
 * Rules:
 *   CRITICAL    — health < 50, OR readiness < 40, OR worst component < 35
 *   MAINTENANCE — health 50–79, OR readiness 40–74, OR worst component 35–65
 *   READY       — health >= 80, readiness >= 75, no component below 66
 */
function computeStatus(health, readiness, components) {
  const worstComp = components.length
    ? Math.min(...components.map(c => c.health))
    : health;

  if (health < 50 || readiness < 40 || worstComp < 35) return 'CRITICAL';
  if (health < 80 || readiness < 75 || worstComp < 66) return 'MAINTENANCE';
  return 'READY';
}

/**
 * Maintenance Priority Score (0–100).
 * Higher = more urgent maintenance needed.
 */
function computeMaintenancePriority(health, readiness, components, nextMaintDays) {
  const worstComp = components.length
    ? Math.min(...components.map(c => c.health))
    : health;
  const compScore = Math.max(0, 100 - worstComp);       // 0–85
  const healthScore = Math.max(0, 100 - health) * 0.5;  // 0–50
  const readScore = Math.max(0, 100 - readiness) * 0.4; // 0–40
  const urgency = nextMaintDays <= 3 ? 20 : nextMaintDays <= 7 ? 10 : 0;
  const raw = compScore * 0.5 + healthScore * 0.3 + readScore * 0.15 + urgency;
  return Math.min(100, Math.round(raw));
}

function getPriorityLabel(score) {
  if (score >= 75) return 'URGENT';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

function getRiskFromHealth(health) {
  if (health >= 85) return 'LOW';
  if (health >= 70) return 'MEDIUM';
  if (health >= 55) return 'HIGH';
  return 'CRITICAL';
}

function getReadinessFromHealth(health, rand) {
  const variance = (rand() - 0.5) * 10;
  return Math.max(20, Math.min(99, Math.round(health * 0.9 + variance)));
}

function generateComponents(catComponents, rand, baseHealth) {
  return catComponents.map((compName, idx) => {
    let h;
    if (baseHealth < 55) {
      h = idx === 0
        ? Math.round(baseHealth * 0.55 + rand() * 10)
        : Math.round(baseHealth + rand() * 30 - 5);
    } else {
      const spread = (rand() - 0.4) * 28;
      h = Math.round(Math.min(99, Math.max(25, baseHealth + spread)));
    }
    h = Math.max(15, Math.min(99, h));
    const status = h < 55 ? 'CRITICAL' : h < 70 ? 'WARNING' : 'HEALTHY';
    return {
      id: compName.toLowerCase().replace(/\s+/g, '_'),
      name: compName,
      health: h,
      status,
      problem: h < 70 ? PROBLEMS[compName] || `${compName} performance degraded` : null,
    };
  });
}

function generateFleet(scanSeed = 42) {
  const rand = seededRandom(scanSeed);
  const fleet = [];
  const lastCheckOptions = ['Just Now', '1 min ago', '2 min ago', '3 min ago', '5 min ago'];

  CATEGORIES.forEach((cat) => {
    for (let i = 1; i <= cat.count; i++) {
      const id = `${cat.prefix}-${String(i).padStart(3, '0')}`;
      const nameBase = cat.names[Math.floor(rand() * cat.names.length)];
      const name = `${nameBase}-${String.fromCharCode(65 + Math.floor(rand() * 6))}${i}`;

      // Health distribution:
      //   ~3%  critical (25–49)
      //   ~22% maintenance (50–79)
      //   ~75% ready (80–99)
      const roll = rand();
      let health;
      if (roll < 0.03) health = Math.round(25 + rand() * 24);      // CRITICAL range
      else if (roll < 0.25) health = Math.round(50 + rand() * 29); // MAINTENANCE range
      else health = Math.round(80 + rand() * 19);                  // READY range

      const readiness = getReadinessFromHealth(health, rand);
      const components = generateComponents(cat.components, rand, health);
      const status = computeStatus(health, readiness, components);
      const risk = getRiskFromHealth(health);

      const criticalComp = components.find(c => c.health < 70);
      const criticalComponent = criticalComp ? criticalComp.name : null;

      const nextMaintDays = health < 55
        ? Math.round(rand() * 4 + 1)
        : Math.round(rand() * 25 + 5);
      const nextMaintenance = `${nextMaintDays} days`;

      const maintenancePriorityScore = computeMaintenancePriority(
        health, readiness, components, nextMaintDays
      );
      const maintenancePriority = getPriorityLabel(maintenancePriorityScore);

      const aiExplanation = criticalComp
        ? `${name} overall health is ${health}%. Readiness reduced to ${readiness}% because ${criticalComp.name} is at ${criticalComp.health}% — ${criticalComp.problem || 'degraded performance detected'}. ${status === 'CRITICAL' ? 'Immediate grounding recommended.' : 'Schedule maintenance within ' + nextMaintenance + '.'}`
        : `${name} is operating within nominal parameters. All subsystems healthy. Next scheduled maintenance in ${nextMaintenance}.`;

      fleet.push({
        id,
        name,
        category: cat.key,
        health,
        readiness,
        status,
        risk,
        criticalComponent,
        maintenancePriority,
        maintenancePriorityScore,
        lastCheck: lastCheckOptions[Math.floor(rand() * lastCheckOptions.length)],
        nextMaintenance,
        nextMaintDays,
        components,
        aiExplanation,
        problemLocation: criticalComp?.id || null,
      });
    }
  });

  return fleet;
}

// ─── Singleton fleet ────────────────────────────────────────────────────────
let _fleet = null;
let _scanSeed = 42;

export function getFleet() {
  if (!_fleet) _fleet = generateFleet(_scanSeed);
  return _fleet;
}

export function reScanFleet() {
  _scanSeed = Math.floor(Math.random() * 999999);
  _fleet = generateFleet(_scanSeed);
  return _fleet;
}

/**
 * Fleet-wide stats — no LIMITED, three statuses only.
 */
export function getFleetStats(fleet) {
  const total = fleet.length;
  const ready = fleet.filter(e => e.status === 'READY').length;
  const maintenance = fleet.filter(e => e.status === 'MAINTENANCE').length;
  const critical = fleet.filter(e => e.status === 'CRITICAL').length;
  const avgHealth = Math.round(fleet.reduce((s, e) => s + e.health, 0) / total);
  const avgReadiness = Math.round(fleet.reduce((s, e) => s + e.readiness, 0) / total);
  return { total, ready, maintenance, critical, avgHealth, avgReadiness };
}

/**
 * Per-category stats — no LIMITED.
 */
export function getCategoryStats(fleet) {
  return CATEGORIES.map(cat => {
    const items = fleet.filter(e => e.category === cat.key);
    const ready = items.filter(e => e.status === 'READY').length;
    const maintenance = items.filter(e => e.status === 'MAINTENANCE').length;
    const critical = items.filter(e => e.status === 'CRITICAL').length;
    const avgReadiness = items.length
      ? Math.round(items.reduce((s, e) => s + e.readiness, 0) / items.length)
      : 0;
    const avgHealth = items.length
      ? Math.round(items.reduce((s, e) => s + e.health, 0) / items.length)
      : 0;
    return {
      key: cat.key,
      prefix: cat.prefix,
      count: cat.count,
      scanned: items.length,
      ready,
      maintenance,
      critical,
      avgReadiness,
      avgHealth,
    };
  });
}

/**
 * Default sort order for ALL EQUIPMENT:
 *   1. MAINTENANCE (most urgent first by maintenancePriorityScore desc)
 *   2. READY       (highest health desc)
 *   3. CRITICAL    (lowest health first — most severe)
 */
export function defaultFleetSort(fleet) {
  const ORDER = { MAINTENANCE: 0, READY: 1, CRITICAL: 2 };
  return [...fleet].sort((a, b) => {
    const oa = ORDER[a.status] ?? 3;
    const ob = ORDER[b.status] ?? 3;
    if (oa !== ob) return oa - ob;
    if (a.status === 'MAINTENANCE') return b.maintenancePriorityScore - a.maintenancePriorityScore;
    if (a.status === 'READY') return b.health - a.health;
    if (a.status === 'CRITICAL') return a.health - b.health;
    return 0;
  });
}

export { CATEGORIES };
