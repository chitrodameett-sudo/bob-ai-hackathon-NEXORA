import React, { useState } from 'react';
import { Box, Cpu, Activity, Thermometer, Zap, Clock, ShieldCheck, AlertTriangle, Layers, ChevronRight } from 'lucide-react';
import Asset3DViewer from '../components/3d/Asset3DViewer';

export default function DigitalTwinPage() {
  const [selectedType, setSelectedType] = useState('Aircraft');
  const [selectedSubsystem, setSelectedSubsystem] = useState('Power & Propulsion');

  const assetDetails = {
    'Aircraft': {
      id: 'AERO-101',
      name: 'Stealth Tactical Jet Fighter',
      health: 92,
      temperature: 68,
      vibration: 1.2,
      operatingHours: 2450,
      lastMaintenance: '12 days ago',
      nextMaintenance: 'In 18 days',
      partsAvail: 95,
      supplierRisk: 'LOW (15/100)',
      readinessScore: 94,
      aiExplanation: 'Asset operational telemetry is optimal. Power & Propulsion turbine thermal output within standard operating envelope.'
    },
    'Turbofan Engine': {
      id: 'ENG-204',
      name: 'High-Thrust Turbofan Propulsion Unit',
      health: 84,
      temperature: 82,
      vibration: 2.1,
      operatingHours: 4120,
      lastMaintenance: '5 days ago',
      nextMaintenance: 'In 8 days',
      partsAvail: 72,
      supplierRisk: 'MEDIUM (42/100)',
      readinessScore: 78,
      aiExplanation: 'Subsystem healthy — monitor Combustor Chamber cooling. Upstream turbine blade vendor lead time extended by 7 days.'
    },
    'Ground Vehicle': {
      id: 'VEH-301',
      name: 'Heavy Recon Armored Vehicle',
      health: 88,
      temperature: 62,
      vibration: 1.8,
      operatingHours: 1850,
      lastMaintenance: '22 days ago',
      nextMaintenance: 'In 14 days',
      partsAvail: 88,
      supplierRisk: 'LOW (22/100)',
      readinessScore: 89,
      aiExplanation: 'Powertrain performance nominal. Hydraulic pressure baseline consistent.'
    },
    'Phased Radar': {
      id: 'RAD-402',
      name: 'Smart Phased Radar Array',
      health: 96,
      temperature: 45,
      vibration: 0.4,
      operatingHours: 5200,
      lastMaintenance: '30 days ago',
      nextMaintenance: 'In 25 days',
      partsAvail: 92,
      supplierRisk: 'LOW (18/100)',
      readinessScore: 95,
      aiExplanation: 'Transceiver module array operating at full gain efficiency.'
    }
  };

  const current = assetDetails[selectedType] || assetDetails['Aircraft'];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 font-mono">
        <div>
          <div className="flex items-center space-x-2">
            <Box className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">3D DIGITAL TWIN MATRIX</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time Physical Telemetry & Component Health Simulation</p>
        </div>

        {/* Asset Type Selector */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['Aircraft', 'Turbofan Engine', 'Ground Vehicle', 'Phased Radar'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all ${
                selectedType === type
                  ? 'bg-cyan-500 text-black font-extrabold shadow-glow-cyan'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 columns: 3D Scene */}
        <div className="lg:col-span-8 space-y-4">
          <Asset3DViewer 
            assetType={selectedType} 
            assetHealth={current.health}
            onSelectSubsystem={(name) => setSelectedSubsystem(name)} 
          />

          {/* Telemetry Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl glass-panel space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-cyan-400" /> <span>TEMPERATURE</span>
              </span>
              <p className="text-lg font-extrabold text-white">{current.temperature}°C</p>
            </div>
            <div className="p-3 rounded-xl glass-panel space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> <span>VIBRATION</span>
              </span>
              <p className="text-lg font-extrabold text-white">{current.vibration} mm/s</p>
            </div>
            <div className="p-3 rounded-xl glass-panel space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> <span>OP HOURS</span>
              </span>
              <p className="text-lg font-extrabold text-white">{current.operatingHours} hrs</p>
            </div>
            <div className="p-3 rounded-xl glass-panel space-y-1">
              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5 text-rose-400" /> <span>NEXT MAINT</span>
              </span>
              <p className="text-lg font-extrabold text-cyan-400">{current.nextMaintenance}</p>
            </div>
          </div>
        </div>

        {/* Right 4 columns: Asset Telemetry Sidebar */}
        <div className="lg:col-span-4 space-y-4 font-mono text-xs">
          <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid">
            <div className="border-b border-slate-800 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-extrabold text-base">{current.id}</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-bold">
                  {current.readinessScore}% READINESS
                </span>
              </div>
              <h3 className="text-white font-bold mt-1">{current.name}</h3>
            </div>

            {/* Subsystems Health Progress Bars */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Subsystem Telemetry</span>
              {[
                { name: 'Power & Propulsion', health: 94 },
                { name: 'Avionics & Sensors', health: 91 },
                { name: 'Thermal Management', health: 87 },
                { name: 'Hydraulics & Actuators', health: 96 }
              ].map(sub => (
                <div key={sub.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className={selectedSubsystem === sub.name ? 'text-cyan-300 font-bold' : 'text-slate-300'}>{sub.name}</span>
                    <span className="text-slate-400">{sub.health}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${sub.health > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`} 
                      style={{ width: `${sub.health}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Explanation Box */}
            <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 text-[10px] font-bold uppercase">
                <Cpu className="w-3.5 h-3.5" />
                <span>AI DIAGNOSIS</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                “{current.aiExplanation}”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Twin Life-Cycle Timeline Section */}
      <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid font-mono text-xs">
        <h3 className="font-bold text-white uppercase text-sm border-b border-slate-800 pb-2">
          DIGITAL TWIN LIFE-CYCLE TIMELINE
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 pt-2">
          {[
            { step: 'Commissioning', date: 'Jan 2024', status: 'COMPLETED' },
            { step: 'Deployment', date: 'Mar 2024', status: 'COMPLETED' },
            { step: 'Inspection', date: 'Aug 2025', status: 'COMPLETED' },
            { step: 'Prev Maint', date: 'Feb 2026', status: 'COMPLETED' },
            { step: 'Current Status', date: 'Present', status: 'ACTIVE' },
            { step: 'Next Overhaul', date: 'Scheduled', status: 'FUTURE' }
          ].map((t, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[9px] text-cyan-400 font-bold block">{t.step}</span>
              <p className="text-white font-bold">{t.date}</p>
              <span className="text-[9px] text-slate-400 uppercase block">{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
