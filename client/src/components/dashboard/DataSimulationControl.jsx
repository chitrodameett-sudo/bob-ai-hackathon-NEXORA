import React from 'react';
import { Sliders, RefreshCw, X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export default function DataSimulationControl({ isOpen, onClose }) {
  const { params, updateParam, resetSimulation, simulationActive } = useSimulation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#0B0F19] border border-cyan-500/30 rounded-xl max-w-xl w-full p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono text-base font-bold text-white">LIVE SIMULATION & DATA CONTROL PANEL</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-mono text-slate-400">
          Adjust defense readiness factors below to test dynamic real-time recalculations across the 3D twin, fleet dashboard, and AI reasoning engine.
        </p>

        {/* Sliders & Inputs */}
        <div className="space-y-4">
          {/* Supplier Lead Time Delay */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Supplier Lead Time Delay</span>
              <span className="text-cyan-400 font-bold">+{params.supplierDelayDays} Days</span>
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
          </div>

          {/* Maintenance Workforce Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Depot Maintenance Workforce Capacity</span>
              <span className={params.workforceCapacityPercent < 75 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {params.workforceCapacityPercent}%
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

          {/* Raw Material Shortage Category */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 block">Simulate Raw Material Sourcing Bottleneck</label>
            <select
              value={params.materialShortageCategory}
              onChange={(e) => updateParam('materialShortageCategory', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="NONE">None (Normal Material Flow)</option>
              <option value="ALUMINUM">Aluminum Alloys (Fuselage & Turbine Casing)</option>
              <option value="COMPOSITE">Carbon Fiber Composites (Wings & Structural Spars)</option>
              <option value="ELECTRONICS">Semiconductor Logic & Phased Transceivers</option>
              <option value="BATTERY">Lithium Power Matrix Components</option>
            </select>
          </div>

          {/* Logistics Transport Disruption */}
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300 block">Transportation & Freight Logistics Disruption</label>
            <select
              value={params.transportDisruptionLevel}
              onChange={(e) => updateParam('transportDisruptionLevel', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none"
            >
              <option value="NONE">Optimal Freight Clearance (None)</option>
              <option value="LOW">Minor Transit Bottlenecks (+5 Days Lead Time)</option>
              <option value="MEDIUM">Regional Port Chokepoint (+12 Days Lead Time)</option>
              <option value="HIGH">Severe Global Air/Sea Transit Halt (+25 Days Lead Time)</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetSimulation}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400 transition-colors shadow-glow-cyan"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
