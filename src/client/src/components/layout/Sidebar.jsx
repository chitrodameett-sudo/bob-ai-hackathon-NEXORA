import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Box, Wrench, Sliders, Package,
  AlertTriangle, Settings, Sparkles, Plane, Shield,
  Truck, Radar, Anchor, Zap, ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';

const NAV_GROUPS = [
  {
    label: 'MONITORING',
    items: [
      { path: '/dashboard',  label: 'COMMAND CENTER', icon: LayoutDashboard },
      { path: '/equipment',  label: 'ALL EQUIPMENT',  icon: Box, countKey: 'ALL EQUIPMENT' },
      { path: '/equipment?cat=Aircraft',         label: 'AIRCRAFT',         icon: Plane,   countKey: 'AIRCRAFT' },
      { path: '/equipment?cat=Armored Vehicles', label: 'ARMORED VEHICLES', icon: Shield,  countKey: 'ARMORED VEHICLES' },
      { path: '/equipment?cat=Ground Vehicles',  label: 'GROUND VEHICLES',  icon: Truck,   countKey: 'GROUND VEHICLES' },
      { path: '/equipment?cat=Air Defense',      label: 'AIR DEFENSE',      icon: Radar,   countKey: 'AIR DEFENSE' },
      { path: '/equipment?cat=Naval Systems',    label: 'NAVAL SYSTEMS',    icon: Anchor,  countKey: 'NAVAL SYSTEMS' },
      { path: '/equipment?cat=Support Systems',  label: 'SUPPORT SYSTEMS',  icon: Zap,     countKey: 'SUPPORT SYSTEMS' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { path: '/maintenance', label: 'MAINTENANCE',   icon: Wrench },
      { path: '/inventory',   label: 'PARTS & STOCK', icon: Package },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { path: '/simulator',    label: 'READINESS SIM', icon: Sliders },
      { path: '/alerts',       label: 'ALERT CENTER',  icon: AlertTriangle },
      { path: '/intelligence', label: 'AI INSIGHTS',   icon: Sparkles },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { path: '/settings', label: 'SETTINGS', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({
    'ALL EQUIPMENT': 1248, 'AIRCRAFT': 320, 'ARMORED VEHICLES': 285,
    'GROUND VEHICLES': 410, 'AIR DEFENSE': 96, 'NAVAL SYSTEMS': 72, 'SUPPORT SYSTEMS': 65,
  });

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await api.fetchJson('/assets/summary');
        if (res?.success && res.categories) setCounts(res.categories);
      } catch (err) {
        // Ignore error
      }
    }
    loadSummary();
  }, []);

  const renderItems = (items) => (
    <div className="space-y-1 w-full">
      {items.map((item) => {
        const Icon = item.icon;
        const fullPath = `${location.pathname}${location.search}`;
        const isActive =
          fullPath === item.path ||
          (item.path === '/equipment' && location.pathname === '/equipment' && !location.search);
        const count = item.countKey ? counts[item.countKey] : undefined;

        return (
          <div key={item.path} className="relative group w-full block">
            <NavLink
              to={item.path}
              className={`flex items-center w-full ${collapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'} rounded-lg text-[13px] font-medium transition-colors relative cursor-pointer ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
              )}
              <div className={`flex items-center ${collapsed ? '' : 'space-x-3'} w-full`}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!collapsed && count !== undefined && (
                <span className="bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                  {count}
                </span>
              )}
            </NavLink>
            
            {/* Custom Tooltip for Collapsed Sidebar */}
            {collapsed && (
              <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-slate-200 text-[12px] font-medium rounded shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#0f172a] border-r border-slate-800 min-h-[calc(100vh-56px)] transition-all duration-300 ease-in-out relative z-30 ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3.5 top-6 z-40 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors shadow-sm cursor-pointer"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav content */}
      <div className={`flex-1 overflow-y-auto py-4 space-y-5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-3 py-1 text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                {group.label}
              </div>
            )}
            {collapsed && <div className="border-t border-slate-800/80 mb-2 mt-2 w-8 mx-auto" />}
            {renderItems(group.items)}
          </div>
        ))}
      </div>

      {/* Footer badge */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">NEXORA Platform</span>
              <span className="text-blue-400 font-medium text-[10px] uppercase">Enterprise</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-400">1,248 Assets Monitored</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
