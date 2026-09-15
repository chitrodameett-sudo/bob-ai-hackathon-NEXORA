import React from 'react';
import { Sliders, Activity, AlertTriangle, RefreshCw, Sparkles, TrendingDown, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function ResilienceSimulatorPage() {
  const { params, updateParam, resetSimulation, simulationActive, simulationData, simulating } = useSimulation();

  const impact = simulationData?.impactSummary || {
    affectedAssetsCount: 17,
    readinessImpactPercent: -8,
    criticalComponentsAffected: 6,
    estimatedRecoveryDays: 23
  };

  const baselineReadiness = simulationData?.baselineKpis?.overallReadiness || 87;
  const simulatedReadiness = simulationData?.simulatedKpis?.overallReadiness || 79;

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">WHAT-IF RESILIENCE SIMULATOR</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Stress-test External Supply Disruptions & Depot Workload Bottlenecks</p>
        </div>

        <button
          onClick={resetSimulation}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* Main Grid: Controls vs Simulated Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Disruption Scenario Controls */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-xl space-y-5 hud-grid">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm uppercase flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>1. CONFIGURE DISRUPTION PARAMETERS</span>
            </h3>
            <span className="text-[10px] text-cyan-400">REALTIME MODEL</span>
          </div>

          {/* Scenario 1: Supplier Delay */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white font-bold">Scenario 1: Supplier Lead Time Delay</span>
              <span className="text-cyan-400 font-extrabold">+{params.supplierDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="45"
              step="1"
              value={params.supplierDelayDays}
              onChange={(e) => updateParam('supplierDelayDays', Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Simulates tier-1 vendor production delays due to raw material refining constraints.</p>
          </div>

          {/* Scenario 2: Material Shortage */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">Scenario 2: Raw Material Sourcing Bottleneck</label>
            <select
              value={params.materialShortageCategory}
              onChange={(e) => updateParam('materialShortageCategory', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="NONE">None (Normal Material Flow)</option>
              <option value="ALUMINUM">Aluminum Alloys (Fuselage & Casing Spares)</option>
              <option value="COMPOSITE">Carbon Fiber Composites (Wing Spars & Thermal Shielding)</option>
              <option value="ELECTRONICS">Semiconductor Logic & Phased Arrays</option>
              <option value="BATTERY">Lithium Power Matrix Components</option>
            </select>
          </div>

          {/* Scenario 3: Maintenance Capacity */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white font-bold">Scenario 3: Maintenance Workforce Reduction</span>
              <span className={params.workforceCapacityPercent < 75 ? 'text-amber-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                {params.workforceCapacityPercent}% Capacity
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              step="5"
              value={params.workforceCapacityPercent}
              onChange={(e) => updateParam('workforceCapacityPercent', Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Scenario 4: Transportation */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-white block">Scenario 4: Logistics Freight Disruption</label>
            <select
              value={params.transportDisruptionLevel}
              onChange={(e) => updateParam('transportDisruptionLevel', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="NONE">Optimal Freight Clearance (None)</option>
              <option value="LOW">Minor Transit Delay (+5 Days)</option>
              <option value="MEDIUM">Regional Maritime Chokepoint (+12 Days)</option>
              <option value="HIGH">Severe Global Transit Halt (+25 Days)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Dynamic Impact Results */}
        <div className="lg:col-span-6 space-y-4 font-mono text-xs">
          {/* Readiness Drop Comparison Box */}
          <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid border-cyan-500/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm uppercase flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>2. SIMULATED DOWNSTREAM READINESS IMPACT</span>
              </h3>
              {simulating && <span className="text-cyan-400 animate-spin">●</span>}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">BASELINE READINESS</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{baselineReadiness}%</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 shadow-glow-amber">
                <span className="text-[10px] text-amber-400 block uppercase font-bold">PROJECTED READINESS</span>
                <span className={`text-3xl font-extrabold mt-1 block ${simulatedReadiness < baselineReadiness ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {simulatedReadiness}%
                </span>
              </div>
            </div>

            {/* Impact Metrics Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block">AFFECTED ASSETS</span>
                <span className="text-lg font-extrabold text-rose-400">{impact.affectedAssetsCount} Units</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block">READINESS DROP</span>
                <span className="text-lg font-extrabold text-amber-400">{impact.readinessImpactPercent}%</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block">CRITICAL PARTS</span>
                <span className="text-lg font-extrabold text-cyan-400">{impact.criticalComponentsAffected} Items</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-[9px] text-slate-400 uppercase block">RECOVERY TIME</span>
                <span className="text-lg font-extrabold text-emerald-400">{impact.estimatedRecoveryDays} Days</span>
              </div>
            </div>

            {/* AI Simulation Summary Explanation */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1.5">
              <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>AI SCENARIO REASONING ENGINE</span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">
                {simulationData?.aiSimulationSummary || `Simulated disruption results in an estimated ${Math.abs(impact.readinessImpactPercent)}% change in overall fleet readiness. ${impact.affectedAssetsCount} assets experience degraded readiness index. Expected supply-chain recovery window: ${impact.estimatedRecoveryDays} days.`}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
