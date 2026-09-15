import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, ShieldCheck, Filter, Search, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';
import PageHeader from '../components/common/PageHeader';

export default function PredictiveMaintenancePage() {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await api.getMaintenance({ priority: filterPriority, search: searchTerm });
      if (res && res.success) {
        setMaintenanceList(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, [filterPriority, searchTerm]);

  return (
    <div className="space-y-5 pb-12 font-jb">
      <PageHeader
        title="PREDICTIVE MAINTENANCE QUEUE"
        subtitle="Smart Priority Engine • Failure Probability & Resource Availability"
        icon={Wrench}
        badge="AI"
        badgeColor="amber"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter asset or part..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none w-44"
            />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:border-cyan-400 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>
        </div>
      </PageHeader>

      {/* AI Priority Engine Explanation Banner */}
      <div className="p-4 rounded-xl glass-panel border-cyan-500/30 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-cyan-400 mt-0.5 animate-pulse" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-cyan-300">AI SMART MAINTENANCE PRIORITY MATRIX</h4>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Instead of sorting strictly by failure probability, AEROVIGIL calculates priority using: <span className="text-white font-bold">Failure Risk (40%) + Component Stock Shortage (30%) + Supplier Disruption Risk (30%)</span>.
          </p>
        </div>
      </div>

      {/* Table of Maintenance Tasks */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="p-3">Asset ID</th>
                <th className="p-3">Target Subsystem</th>
                <th className="p-3">Health</th>
                <th className="p-3">Failure Risk</th>
                <th className="p-3">Part Availability</th>
                <th className="p-3">Maint. Window</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Recommended AI Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {maintenanceList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-slate-500">
                    No matching predictive maintenance records found.
                  </td>
                </tr>
              ) : (
                maintenanceList.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white">{m.assetId}</td>
                    <td className="p-3 text-slate-300">{m.componentName}</td>
                    <td className="p-3">
                      <span className={m.currentHealthScore < 75 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {m.currentHealthScore}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={m.failureRiskPercent > 70 ? 'text-rose-400 font-extrabold' : 'text-amber-400 font-bold'}>
                        {m.failureRiskPercent}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={m.partAvailabilityStatus === 'SHORTAGE' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {m.partAvailabilityStatus} (Stock: {m.componentStock})
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{m.expectedMaintenanceWindow}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                        m.priority === 'CRITICAL' 
                          ? 'border-rose-500/60 text-rose-400 bg-rose-950/40 shadow-glow-rose'
                          : m.priority === 'HIGH'
                          ? 'border-amber-500/50 text-amber-400 bg-amber-950/30'
                          : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                      }`}>
                        {m.priority}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-300 max-w-xs leading-tight">
                      {m.recommendedAction}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
