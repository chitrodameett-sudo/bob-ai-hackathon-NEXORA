import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Cpu, Activity, AlertTriangle, ShieldCheck, ArrowLeft, Clock, Sparkles } from 'lucide-react';
import Asset3DViewer from '../components/3d/Asset3DViewer';
import { api } from '../services/api';

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      const res = await api.fetchJson(`/assets/${id || 'AF-002'}`);
      if (res && res.success) {
        setEquipment(res.data);
      }
      setLoading(false);
    }
    loadDetail();
  }, [id]);

  const eq = equipment || {
    id: id || 'AF-002',
    name: 'Falcon-A2',
    category: 'Aircraft',
    type: 'Tactical Jet',
    health: 68,
    readiness: 51,
    status: 'CRITICAL',
    lastCheck: '2 min ago',
    nextMaintenance: '8 days',
    criticalComponent: 'Cooling System',
    problemLocation: 'cooling_subsystem',
    components: [
      { id: 'engine', name: 'Engine Power Turbine', health: 96, status: 'HEALTHY' },
      { id: 'cooling', name: 'Cooling System', health: 41, status: 'CRITICAL', problem: 'Temperature above safety threshold', problemLocation: 'cooling_subsystem' },
      { id: 'electrical', name: 'Electrical Power Bus', health: 94, status: 'HEALTHY' },
      { id: 'avionics', name: 'Avionics Logic Module', health: 91, status: 'HEALTHY' },
      { id: 'hydraulics', name: 'Hydraulic Actuators', health: 89, status: 'HEALTHY' },
      { id: 'structure', name: 'Structural Airframe', health: 97, status: 'HEALTHY' }
    ],
    aiExplanation: 'Equipment health is 68%, but readiness is reduced to 51% because Cooling System health is critically low (41%). Inspection required.'
  };

  const problemComponent = eq.components?.find(c => c.health < 70) || eq.components?.[0];

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Top Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/equipment" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300">
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white uppercase">{eq.id} — {eq.name}</h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
                eq.status === 'CRITICAL' ? 'border-rose-500/60 text-rose-400 bg-rose-950/40 shadow-glow-rose animate-pulse' : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
              }`}>
                {eq.status === 'CRITICAL' ? 'NOT READY' : eq.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Category: {eq.category} • Type: {eq.type}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-3xl font-extrabold text-cyan-400 block">{eq.readiness}%</span>
          <span className="text-[10px] text-slate-400 uppercase">OVERALL READINESS</span>
        </div>
      </div>

      {/* Main Grid: 3D Twin with Exact Problem Location vs Equipment Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Twin Model with Highlighted Problem Subsystem */}
        <div className="lg:col-span-7 space-y-4">
          <Asset3DViewer 
            category={eq.category} 
            equipmentHealth={eq.health} 
            problemComponent={problemComponent} 
          />

          <div className="p-4 rounded-xl glass-panel space-y-2 border-cyan-500/20">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI READINESS & WHY IS EQUIPMENT NOT READY?</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              “{eq.aiExplanation}”
            </p>
          </div>
        </div>

        {/* Right Column: Equipment Information & Component Health Breakdown */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <span className="text-cyan-400 font-bold text-base uppercase">{eq.name}</span>
                <p className="text-[10px] text-slate-400">Category: {eq.category}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white block">Health: {eq.health}%</span>
                <span className="text-[10px] text-slate-400">Check: {eq.lastCheck}</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">HEALTH</span>
                <span className="text-lg font-extrabold text-white">{eq.health}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 shadow-glow-cyan">
                <span className="text-[9px] text-cyan-400 uppercase block">READINESS</span>
                <span className="text-lg font-extrabold text-cyan-300">{eq.readiness}%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase block">NEXT MAINT</span>
                <span className="text-lg font-extrabold text-amber-400">{eq.nextMaintenance}</span>
              </div>
            </div>

            {/* Component Health List */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block border-b border-slate-800/80 pb-1">
                Subsystem Component Health Breakdown
              </span>

              {eq.components?.map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{c.name}</span>
                    <span className={`font-extrabold ${c.health < 60 ? 'text-rose-400' : c.health < 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {c.health}% HEALTH
                    </span>
                  </div>

                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${c.health < 60 ? 'bg-rose-500' : c.health < 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${c.health}%` }}
                    />
                  </div>

                  {c.problem && (
                    <p className="text-[10px] text-rose-400 font-bold mt-1 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 inline" />
                      <span>{c.problem}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
