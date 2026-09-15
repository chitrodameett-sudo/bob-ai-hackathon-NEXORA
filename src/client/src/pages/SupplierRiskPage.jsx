import React, { useState, useEffect } from 'react';
import { Truck, AlertTriangle, ShieldCheck, Filter, Search, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function SupplierRiskPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSuppliers() {
      const res = await api.getSuppliers({ riskLevel: riskFilter, search: searchTerm });
      if (res && res.success) {
        setSuppliers(res.data);
      }
      setLoading(false);
    }
    loadSuppliers();
  }, [riskFilter, searchTerm]);

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">SUPPLIER RISK INTELLIGENCE</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Tier-1 & Tier-2 Defense Vendor Reliability & Disruption Monitoring</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none w-44"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-400 outline-none"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Supplier Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Supplier ID & Name</th>
                <th className="p-3">Region</th>
                <th className="p-3">Category</th>
                <th className="p-3">Reliability</th>
                <th className="p-3">Avg Lead Time</th>
                <th className="p-3">Inventory Stock</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">AI Risk Intelligence Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-white">
                    <span className="text-cyan-400 block">{s.id}</span>
                    <span>{s.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">{s.region}</td>
                  <td className="p-3 text-slate-400">{s.suppliedCategory}</td>
                  <td className="p-3">
                    <span className={s.reliability > 85 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {s.reliability}%
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{s.averageLeadTimeDays} Days</td>
                  <td className="p-3 text-slate-300">{s.inventoryAvailability}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                      s.riskLevel === 'HIGH'
                        ? 'border-rose-500/60 text-rose-400 bg-rose-950/40 shadow-glow-rose'
                        : s.riskLevel === 'MEDIUM'
                        ? 'border-amber-500/50 text-amber-400 bg-amber-950/30'
                        : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                    }`}>
                      {s.riskLevel} ({s.riskScore}/100)
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-300 max-w-xs leading-tight">
                    {s.aiNotes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
