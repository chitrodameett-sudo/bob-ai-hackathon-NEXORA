import React, { useState } from 'react';
import { Globe, MapPin, AlertTriangle, ShieldCheck, Truck, ChevronRight } from 'lucide-react';

export default function GlobalSupplyMap() {
  const [selectedNode, setSelectedNode] = useState(null);

  const locations = [
    { id: 'loc-1', name: 'North America Aerospace Hub', region: 'North America', status: 'HEALTHY', risk: 'LOW', nodeCount: 18, leadTimeAvg: '12 Days', coords: '38.89, -77.03' },
    { id: 'loc-2', name: 'European Defense Logistics Center', region: 'Europe (Frankfurt)', status: 'WARNING', risk: 'HIGH', nodeCount: 14, leadTimeAvg: '34 Days', coords: '50.11, 8.68' },
    { id: 'loc-3', name: 'Indo-Pacific Precision Components Node', region: 'Asia-Pacific', status: 'HEALTHY', risk: 'MEDIUM', nodeCount: 12, leadTimeAvg: '18 Days', coords: '1.35, 103.81' },
    { id: 'loc-4', name: 'Middle East Logistics Depot', region: 'Middle East', status: 'HEALTHY', risk: 'LOW', nodeCount: 8, leadTimeAvg: '14 Days', coords: '25.20, 55.27' },
    { id: 'loc-5', name: 'Nordic Armor & Shield Station', region: 'Nordic Region', status: 'HEALTHY', risk: 'LOW', nodeCount: 6, leadTimeAvg: '10 Days', coords: '59.32, 18.06' }
  ];

  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'LOW': return 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40 shadow-glow-emerald';
      case 'MEDIUM': return 'border-amber-500/50 text-amber-400 bg-amber-950/40 shadow-glow-amber';
      case 'HIGH': return 'border-rose-500/60 text-rose-400 bg-rose-950/50 shadow-glow-rose animate-pulse';
      default: return 'border-cyan-500/40 text-cyan-400 bg-slate-900';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="font-mono text-sm font-bold text-white uppercase">GLOBAL SUPPLY RESILIENCE MAP</h3>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          NON-SENSITIVE INDUSTRIAL REGIONS
        </div>
      </div>

      {/* Map Nodes Overview List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => setSelectedNode(loc)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${getRiskStyle(loc.risk)} ${selectedNode?.id === loc.id ? 'ring-2 ring-cyan-400' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="font-mono text-xs font-bold">{loc.name}</span>
              </div>
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border border-current">
                {loc.risk} RISK
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <span>Active Nodes: {loc.nodeCount}</span>
              <span>Avg Lead: {loc.leadTimeAvg}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Location Details Panel */}
      {selectedNode && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold uppercase">{selectedNode.name}</span>
            <span className="text-[10px] text-slate-500">COORDS: {selectedNode.coords}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Regional Hub Status: <span className="text-white font-bold">{selectedNode.status}</span>. Upstream component lead times averaging {selectedNode.leadTimeAvg}. AI Resilience Monitoring online.
          </p>
        </div>
      )}
    </div>
  );
}
