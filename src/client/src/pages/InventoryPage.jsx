import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Search, Filter, Box } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function InventoryPage() {
  const [inventoryList, setInventoryList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await api.getInventory({ status: statusFilter, search: searchTerm });
      if (res && res.success) {
        setInventoryList(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, [statusFilter, searchTerm]);

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">CRITICAL PARTS INVENTORY</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Strategic Reserve Stock & Subassembly Replenishment Lead Times</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search part name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none w-44"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-400 outline-none"
          >
            <option value="ALL">All Inventory Status</option>
            <option value="SHORTAGE">Shortage Risk</option>
            <option value="ADEQUATE">Adequate Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Part ID & Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock vs Required</th>
                <th className="p-3">Stock Ratio</th>
                <th className="p-3">Lead Time</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Supplier Risk</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {inventoryList.map(item => {
                const percent = Math.min(100, Math.round((item.stock / (item.required || 1)) * 100));
                return (
                  <tr key={item.partId} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white">
                      <span className="text-cyan-400 block">{item.partId}</span>
                      <span>{item.partName}</span>
                    </td>
                    <td className="p-3 text-slate-300">{item.category}</td>
                    <td className="p-3 text-slate-200">
                      <span className={item.stock < item.required ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {item.stock}
                      </span> / {item.required} Units
                    </td>
                    <td className="p-3 w-36">
                      <div className="space-y-1">
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${percent < 50 ? 'bg-rose-500' : percent < 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 block text-right">{percent}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{item.leadTimeDays} Days</td>
                    <td className="p-3 text-slate-300">{item.supplierName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        item.supplierRisk === 'HIGH' ? 'text-rose-400 bg-rose-950/40 border border-rose-500/50' : 'text-emerald-400 bg-emerald-950/30'
                      }`}>
                        {item.supplierRisk}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                        item.status === 'SHORTAGE'
                          ? 'border-rose-500/60 text-rose-400 bg-rose-950/40 shadow-glow-rose'
                          : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
