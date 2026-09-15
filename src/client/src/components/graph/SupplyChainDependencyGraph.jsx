import React, { useState } from 'react';
import { Network, ArrowRight, AlertTriangle, CheckCircle2, Box, Truck, Warehouse, Wrench, Shield } from 'lucide-react';

export default function SupplyChainDependencyGraph({ onNodeSelect }) {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    { id: 'sup-alpha', label: 'Supplier Alpha', type: 'SUPPLIER', status: 'HEALTHY', risk: 'LOW', details: 'Titanium Castings • 14 days lead time' },
    { id: 'sup-beta', label: 'Supplier Beta', type: 'SUPPLIER', status: 'WARNING', risk: 'HIGH', details: 'Apex Avionics • 37 days lead time (Delayed)' },
    { id: 'comp-104', label: 'Turbine Blades P-104', type: 'COMPONENT', status: 'ADEQUATE', details: 'Stock: 12 (Req: 18) • Lead: 24d' },
    { id: 'comp-107', label: 'Avionics Module P-107', type: 'COMPONENT', status: 'SHORTAGE', details: 'Stock: 2 (Req: 10) • Lead: 37d' },
    { id: 'wh-frankfurt', label: 'Frankfurt Hub #1', type: 'WAREHOUSE', status: 'OPERATIONAL', details: 'Central Logistics Reserve' },
    { id: 'maint-depot', label: 'Depot Repair #4', type: 'MAINTENANCE', status: 'WARNING', details: 'Capacity: 65% (Backlog High)' },
    { id: 'asset-101', label: 'ASSET-101 (Recon Jet)', type: 'ASSET', status: 'OPERATIONAL', readiness: 94 },
    { id: 'asset-107', label: 'ASSET-107 (Tactical Trans)', type: 'ASSET', status: 'AT_RISK', readiness: 61 }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SUPPLIER': return Truck;
      case 'COMPONENT': return Box;
      case 'WAREHOUSE': return Warehouse;
      case 'MAINTENANCE': return Wrench;
      case 'ASSET': return Shield;
      default: return Network;
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'OPERATIONAL':
      case 'HEALTHY':
      case 'ADEQUATE':
        return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20';
      case 'WARNING':
        return 'border-amber-500/50 text-amber-400 bg-amber-950/30 shadow-glow-amber';
      case 'SHORTAGE':
      case 'AT_RISK':
        return 'border-rose-500/60 text-rose-400 bg-rose-950/40 shadow-glow-rose animate-pulse';
      default:
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <h3 className="font-mono text-sm font-bold text-white uppercase">AI SUPPLY CHAIN DEPENDENCY GRAPH</h3>
        </div>
        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded">
          DYNAMIC NODE PROPAGATION
        </div>
      </div>

      <p className="text-xs font-mono text-slate-400">
        Trace how supplier lead time anomalies propagate through component inventories, warehouse staging, and depot maintenance down to asset readiness.
      </p>

      {/* Visual Pipeline Flows */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center py-2">
        {/* Step 1: Suppliers */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-bold text-center">1. SUPPLIERS</div>
          {nodes.filter(n => n.type === 'SUPPLIER').map(n => {
            const Icon = getTypeIcon(n.type);
            return (
              <div
                key={n.id}
                onClick={() => setActiveNode(n)}
                className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all ${getStatusBorder(n.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Icon className="w-4 h-4" />
                    <span>{n.label}</span>
                  </div>
                  {n.risk === 'HIGH' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{n.details}</p>
              </div>
            );
          })}
        </div>

        {/* Arrow 1 */}
        <div className="hidden md:flex justify-center text-slate-600">
          <ArrowRight className="w-6 h-6 animate-pulse text-cyan-500" />
        </div>

        {/* Step 2: Components */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-bold text-center">2. COMPONENTS</div>
          {nodes.filter(n => n.type === 'COMPONENT').map(n => {
            const Icon = getTypeIcon(n.type);
            return (
              <div
                key={n.id}
                onClick={() => setActiveNode(n)}
                className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all ${getStatusBorder(n.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Icon className="w-4 h-4" />
                    <span>{n.label}</span>
                  </div>
                  {n.status === 'SHORTAGE' && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{n.details}</p>
              </div>
            );
          })}
        </div>

        {/* Arrow 2 */}
        <div className="hidden md:flex justify-center text-slate-600">
          <ArrowRight className="w-6 h-6 animate-pulse text-cyan-500" />
        </div>

        {/* Step 3: Maintenance & Assets */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-bold text-center">3. DEPOT & ASSETS</div>
          {nodes.filter(n => n.type === 'ASSET').map(n => {
            const Icon = getTypeIcon(n.type);
            return (
              <div
                key={n.id}
                onClick={() => setActiveNode(n)}
                className={`p-3 rounded-lg border text-xs font-mono cursor-pointer transition-all ${getStatusBorder(n.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Icon className="w-4 h-4" />
                    <span>{n.label}</span>
                  </div>
                  <span className="font-extrabold">{n.readiness}%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Readiness Score: {n.readiness}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Box */}
      {activeNode && (
        <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/30 font-mono text-xs text-slate-300 flex items-center justify-between">
          <div>
            <span className="text-cyan-400 font-bold">{activeNode.label}</span> ({activeNode.type}) — {activeNode.details}
          </div>
          <button onClick={() => setActiveNode(null)} className="text-slate-500 hover:text-white">Clear</button>
        </div>
      )}
    </div>
  );
}
