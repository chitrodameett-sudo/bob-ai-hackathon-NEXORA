// NEXORA — All Equipment Page
// Status model: MAINTENANCE | READY | CRITICAL  (LIMITED removed)
// Default sort: MAINTENANCE first → READY second → CRITICAL third

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Search, ArrowUpDown, ChevronRight, AlertTriangle, Wrench, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useFleetHealth } from '../context/FleetHealthContext';
import { defaultFleetSort } from '../utils/fleetData';

const PAGE_SIZE = 25;

// ─── Helpers ────────────────────────────────────────────────────────────────
function healthColor(h) {
  if (h >= 80) return 'text-emerald-400';
  if (h >= 60) return 'text-amber-400';
  return 'text-rose-400';
}
function healthBarColor(h) {
  if (h >= 80) return 'bg-emerald-400';
  if (h >= 60) return 'bg-amber-400';
  return 'bg-rose-500';
}

function statusBadgeClass(status) {
  switch (status) {
    case 'READY':
      return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20';
    case 'MAINTENANCE':
      return 'border-amber-500/50 text-amber-300 bg-amber-950/30';
    case 'CRITICAL':
      return 'border-rose-500/60 text-rose-300 bg-rose-950/40 shadow-[0_0_8px_rgba(244,63,94,0.25)] animate-pulse';
    default:
      return 'border-slate-700 text-slate-300';
  }
}

function statusIcon(status) {
  switch (status) {
    case 'READY':       return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case 'MAINTENANCE': return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
    case 'CRITICAL':    return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    default:            return null;
  }
}

function priorityBadgeClass(p) {
  switch (p) {
    case 'URGENT': return 'text-rose-400 font-black';
    case 'HIGH':   return 'text-amber-400 font-bold';
    case 'MEDIUM': return 'text-yellow-400 font-bold';
    case 'LOW':    return 'text-slate-400';
    default:       return 'text-slate-600';
  }
}

// ─── Section header row ──────────────────────────────────────────────────────
function SectionDivider({ icon: Icon, label, count, color }) {
  return (
    <tr className={`bg-slate-950/80 border-y ${color}`}>
      <td colSpan="10" className="px-4 py-2">
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
          <span className="font-normal opacity-60">— {count} units</span>
        </div>
      </td>
    </tr>
  );
}

export default function EquipmentListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('cat') || 'ALL';
  const statusParam = searchParams.get('status') || 'ALL';

  const { sortedFleet, stats } = useFleetHealth();

  const [healthFilter, setHealthFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  // Reset page when category or status parameter changes
  useEffect(() => {
    setPage(1);
  }, [catParam, statusParam]);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'ALL') {
      params.delete('cat');
    } else {
      params.set('cat', cat);
    }
    setSearchParams(params);
  };

  const handleStatusChange = (s) => {
    const params = new URLSearchParams(searchParams);
    if (s === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', s);
    }
    setSearchParams(params);
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortAsc(a => !a);
    else { setSortBy(col); setSortAsc(false); }
  };

  // Apply filters on top of the pre-sorted fleet
  const filtered = useMemo(() => {
    let list = sortedFleet;

    if (catParam !== 'ALL') list = list.filter(e => e.category === catParam);
    if (statusParam !== 'ALL') list = list.filter(e => e.status === statusParam);
    if (healthFilter === '90-100') list = list.filter(e => e.health >= 90);
    else if (healthFilter === '70-89') list = list.filter(e => e.health >= 70 && e.health < 90);
    else if (healthFilter === '50-69') list = list.filter(e => e.health >= 50 && e.health < 70);
    else if (healthFilter === '0-49') list = list.filter(e => e.health < 50);
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      list = list.filter(e => e.id.toLowerCase().includes(s) || e.name.toLowerCase().includes(s));
    }

    // Only re-sort if user picked a non-default column
    if (sortBy !== 'default') {
      list = [...list].sort((a, b) => {
        let va = a[sortBy], vb = b[sortBy];
        if (sortBy === 'risk') {
          const o = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
          va = o[a.risk] || 0; vb = o[b.risk] || 0;
        }
        if (sortBy === 'maintenancePriority') {
          const o = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };
          va = o[a.maintenancePriority] || 0; vb = o[b.maintenancePriority] || 0;
        }
        if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        return sortAsc ? va - vb : vb - va;
      });
    }
    return list;
  }, [sortedFleet, catParam, statusParam, healthFilter, searchTerm, sortBy, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Group for display (only when default sort + no specific status filter)
  const useGrouped = sortBy === 'default' && statusParam === 'ALL';
  const maintItems = useGrouped ? paginated.filter(e => e.status === 'MAINTENANCE') : [];
  const readyItems = useGrouped ? paginated.filter(e => e.status === 'READY') : [];
  const critItems  = useGrouped ? paginated.filter(e => e.status === 'CRITICAL') : [];

  return (
    <div className="space-y-5 pb-12 font-mono">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <Box className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
              {catParam === 'ALL' ? 'ALL EQUIPMENT' : catParam.toUpperCase()}
            </h1>
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded font-bold">
              {filtered.length.toLocaleString()} / {stats.total.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Defense Equipment Readiness · Priority: Maintenance → Ready → Critical
          </p>
        </div>

        {/* Fleet stat pills */}
        <div className="flex items-center space-x-2 text-[10px] font-bold">
          <span className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 bg-amber-950/20">
            🔧 {stats.maintenance} MAINTENANCE
          </span>
          <span className="px-2.5 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 bg-emerald-950/20">
            ✓ {stats.ready} READY
          </span>
          <span className="px-2.5 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 bg-rose-950/20">
            🔴 {stats.critical} CRITICAL
          </span>
        </div>
      </div>

      {/* ── Category pills ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        {['ALL', 'Aircraft', 'Armored Vehicles', 'Ground Vehicles', 'Air Defense', 'Naval Systems', 'Support Systems'].map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
              catParam === cat
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Filters row ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ID or name..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-white outline-none w-full"
          />
        </div>

        {/* Status filter — MAINTENANCE | READY | CRITICAL only */}
        <div className="flex items-center space-x-1 text-[10px]">
          <span className="text-slate-500 font-bold mr-1">STATUS:</span>
          {['ALL', 'MAINTENANCE', 'READY', 'CRITICAL'].map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                statusParam === s
                  ? s === 'MAINTENANCE' ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                  : s === 'READY' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                  : s === 'CRITICAL' ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                  : 'bg-slate-800 border border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-900 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Health range */}
        <div className="flex items-center space-x-1 text-[10px]">
          <span className="text-slate-500 font-bold mr-1">HEALTH:</span>
          {['ALL', '90-100', '70-89', '50-69', '0-49'].map(h => (
            <button
              key={h}
              onClick={() => { setHealthFilter(h); setPage(1); }}
              className={`px-2 py-1 rounded text-[9px] font-bold transition-colors ${
                healthFilter === h ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40' : 'text-slate-500 hover:text-white'
              }`}
            >
              {h === 'ALL' ? 'ALL' : `${h}%`}
            </button>
          ))}
        </div>

        {/* Sort control */}
        <select
          value={sortBy}
          onChange={e => { setSortBy(e.target.value); setPage(1); }}
          className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] text-slate-300 focus:border-cyan-400 outline-none"
        >
          <option value="default">Default Order (Maint → Ready → Critical)</option>
          <option value="health">Health %</option>
          <option value="readiness">Readiness %</option>
          <option value="maintenancePriority">Maintenance Priority</option>
          <option value="risk">Risk Level</option>
          <option value="id">Equipment ID</option>
        </select>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[9px]">
                <th className="p-3 pl-4">STATUS</th>
                <th className="p-3">
                  <button onClick={() => handleSort('id')} className="flex items-center space-x-1 hover:text-white">
                    <span>ID</span><ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                </th>
                <th className="p-3">NAME</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">
                  <button onClick={() => handleSort('health')} className="flex items-center space-x-1 hover:text-white">
                    <span>HEALTH</span><ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                </th>
                <th className="p-3">
                  <button onClick={() => handleSort('readiness')} className="flex items-center space-x-1 hover:text-white">
                    <span>READINESS</span><ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                </th>
                <th className="p-3">PRIMARY PROBLEM</th>
                <th className="p-3">
                  <button onClick={() => handleSort('maintenancePriority')} className="flex items-center space-x-1 hover:text-white">
                    <span>MAINT. PRIORITY</span><ArrowUpDown className="w-2.5 h-2.5" />
                  </button>
                </th>
                <th className="p-3">LAST CHECK</th>
                <th className="p-3 pr-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-slate-500">
                    No matching equipment found.
                  </td>
                </tr>
              ) : useGrouped ? (
                <>
                  {/* ── MAINTENANCE section ─────────────────────── */}
                  {maintItems.length > 0 && (
                    <>
                      <SectionDivider
                        icon={Wrench}
                        label="MAINTENANCE REQUIRED"
                        count={filtered.filter(e => e.status === 'MAINTENANCE').length}
                        color="border-amber-500/20 text-amber-400"
                      />
                      {maintItems.map(item => <EquipmentRow key={item.id} item={item} />)}
                    </>
                  )}
                  {/* ── READY section ─────────────────────────── */}
                  {readyItems.length > 0 && (
                    <>
                      <SectionDivider
                        icon={CheckCircle2}
                        label="READY"
                        count={filtered.filter(e => e.status === 'READY').length}
                        color="border-emerald-500/20 text-emerald-400"
                      />
                      {readyItems.map(item => <EquipmentRow key={item.id} item={item} />)}
                    </>
                  )}
                  {/* ── CRITICAL section ─────────────────────── */}
                  {critItems.length > 0 && (
                    <>
                      <SectionDivider
                        icon={ShieldAlert}
                        label="CRITICAL — NOT READY"
                        count={filtered.filter(e => e.status === 'CRITICAL').length}
                        color="border-rose-500/20 text-rose-400"
                      />
                      {critItems.map(item => <EquipmentRow key={item.id} item={item} />)}
                    </>
                  )}
                </>
              ) : (
                paginated.map(item => <EquipmentRow key={item.id} item={item} />)
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length || 1)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()}
          </span>
          <div className="flex items-center space-x-1">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">«</button>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">‹</button>
            <span className="px-3 py-1 text-cyan-400 font-bold">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">›</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white disabled:opacity-30">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Equipment Table Row ─────────────────────────────────────────────────────
function EquipmentRow({ item }) {
  return (
    <tr className="hover:bg-slate-900/60 transition-colors group">
      {/* STATUS */}
      <td className="p-3 pl-4">
        <div className="flex items-center space-x-1.5">
          {statusIcon(item.status)}
          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${statusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        </div>
      </td>

      {/* ID */}
      <td className="p-3 font-black text-cyan-400">{item.id}</td>

      {/* NAME */}
      <td className="p-3 font-bold text-white max-w-[110px] truncate">{item.name}</td>

      {/* CATEGORY */}
      <td className="p-3 text-slate-400 text-[10px]">{item.category}</td>

      {/* HEALTH */}
      <td className="p-3 w-28">
        <div className="space-y-0.5">
          <span className={`font-black text-xs ${healthColor(item.health)}`}>{item.health}%</span>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div className={`h-full ${healthBarColor(item.health)} rounded-full`} style={{ width: `${item.health}%` }} />
          </div>
        </div>
      </td>

      {/* READINESS */}
      <td className="p-3 font-bold text-white text-xs">{item.readiness}%</td>

      {/* PRIMARY PROBLEM */}
      <td className="p-3 text-[10px] max-w-[130px]">
        {item.criticalComponent ? (
          <span className="text-amber-300 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate">{item.criticalComponent}</span>
          </span>
        ) : (
          <span className="text-slate-600">Nominal</span>
        )}
      </td>

      {/* MAINTENANCE PRIORITY */}
      <td className="p-3 text-[10px]">
        {item.status !== 'READY' ? (
          <span className={priorityBadgeClass(item.maintenancePriority)}>
            {item.maintenancePriority}
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        )}
      </td>

      {/* LAST CHECK */}
      <td className="p-3 text-slate-500 text-[10px]">{item.lastCheck}</td>

      {/* ACTION */}
      <td className="p-3 pr-4 text-right">
        <Link
          to={`/equipment/${item.id}`}
          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 hover:bg-cyan-950/60 hover:border-cyan-400 text-cyan-300 font-bold text-[9px] transition-all"
        >
          <span>VIEW</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </td>
    </tr>
  );
}
