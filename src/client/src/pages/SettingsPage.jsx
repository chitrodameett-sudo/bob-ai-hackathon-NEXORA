import React, { useState } from 'react';
import { Settings, Sliders, CheckCircle2, RefreshCw, Shield } from 'lucide-react';

export default function SettingsPage() {
  const [weights, setWeights] = useState({
    health: 35,
    parts: 25,
    maintenance: 15,
    supplier: 15,
    capacity: 10
  });
  const [saved, setSaved] = useState(false);

  const total = weights.health + weights.parts + weights.maintenance + weights.supplier + weights.capacity;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">DYNAMIC SCORING MODEL CONFIGURATION</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Configure Prototype Scoring Formula Weights for Demonstration</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl space-y-5 max-w-2xl border-cyan-500/30">
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
          <strong>PROTOTYPE NOTICE:</strong> Scoring weights are configurable below for demonstration purposes. Formula must total 100%.
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white font-bold">1. Equipment Health Telemetry Weight</span>
              <span className="text-cyan-400 font-bold">{weights.health}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.health}
              onChange={(e) => setWeights({ ...weights, health: Number(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white font-bold">2. Critical Parts Availability Weight</span>
              <span className="text-cyan-400 font-bold">{weights.parts}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.parts}
              onChange={(e) => setWeights({ ...weights, parts: Number(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white font-bold">3. Maintenance Completion Status Weight</span>
              <span className="text-cyan-400 font-bold">{weights.maintenance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={weights.maintenance}
              onChange={(e) => setWeights({ ...weights, maintenance: Number(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white font-bold">4. Upstream Supplier Resilience Weight</span>
              <span className="text-cyan-400 font-bold">{weights.supplier}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={weights.supplier}
              onChange={(e) => setWeights({ ...weights, supplier: Number(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white font-bold">5. Depot Maintenance Capacity Weight</span>
              <span className="text-cyan-400 font-bold">{weights.capacity}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={weights.capacity}
              onChange={(e) => setWeights({ ...weights, capacity: Number(e.target.value) })}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className={`font-bold ${total === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
            Total Formula Weight: {total}% {total !== 100 && '(Must equal 100%)'}
          </span>

          <button
            onClick={handleSave}
            disabled={total !== 100}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold disabled:opacity-50 transition-colors shadow-glow-cyan"
          >
            {saved ? 'Saved Successfully!' : 'Save Formula Weights'}
          </button>
        </div>
      </div>
    </div>
  );
}
