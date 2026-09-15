import React from 'react';
import { Network, Truck, Warehouse, Box, Shield, AlertTriangle } from 'lucide-react';
import SupplyChainDependencyGraph from '../components/graph/SupplyChainDependencyGraph';
import GlobalSupplyMap from '../components/map/GlobalSupplyMap';

export default function SupplyChainPage() {
  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">SUPPLY CHAIN CONTROL TOWER</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Multi-tier Dependency Mapping & Downstream Disruption Analysis</p>
        </div>
      </div>

      {/* Dependency Graph Component */}
      <SupplyChainDependencyGraph />

      {/* Global Map Component */}
      <GlobalSupplyMap />
    </div>
  );
}
