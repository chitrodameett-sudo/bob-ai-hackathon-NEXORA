import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Shield, Activity, Bell, Sparkles, Menu, X,
  LayoutDashboard, Box, Wrench, Sliders, Package,
  AlertTriangle, Settings, Plane, Truck, Radar,
  Anchor, Zap, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden lg:flex flex-col items-end leading-none">
      <span className="text-sm font-semibold text-slate-300 tabular-nums">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </span>
      <span className="text-[10px] text-slate-500 uppercase mt-0.5 font-medium">
        {time.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
      </span>
    </div>
  );
}

const NAV_GROUPS = [
  {
    label: 'MONITORING',
    items: [
      { path: '/dashboard',  label: 'COMMAND CENTER',   icon: LayoutDashboard },
      { path: '/equipment',  label: 'ALL EQUIPMENT',    icon: Box },
      { path: '/equipment?cat=Aircraft',         label: 'AIRCRAFT',         icon: Plane },
      { path: '/equipment?cat=Armored Vehicles', label: 'ARMORED Vehicles', icon: Shield },
      { path: '/equipment?cat=Ground Vehicles',  label: 'GROUND VEHICLES',  icon: Truck },
      { path: '/equipment?cat=Air Defense',      label: 'AIR DEFENSE',      icon: Radar },
      { path: '/equipment?cat=Naval Systems',    label: 'NAVAL SYSTEMS',    icon: Anchor },
      { path: '/equipment?cat=Support Systems',  label: 'SUPPORT SYSTEMS',  icon: Zap },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { path: '/maintenance', label: 'MAINTENANCE',     icon: Wrench },
      { path: '/inventory',   label: 'PARTS & STOCK',   icon: Package },
    ],
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { path: '/simulator',   label: 'READINESS SIM',   icon: Sliders },
      { path: '/alerts',      label: 'ALERT CENTER',    icon: AlertTriangle },
      { path: '/intelligence',label: 'AI INSIGHTS',     icon: Sparkles },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { path: '/settings', label: 'SETTINGS', icon: Settings },
    ],
  },
];

// ── Mobile Drawer ────────────────────────────────────────────
function MobileDrawer({ isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col bg-slate-900 border-r border-slate-800 animate-slide-left overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-bold text-white text-[15px] tracking-wide">NEXORA</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <div className="px-2 py-1 text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-2">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const fullPath = `${location.pathname}${location.search}`;
                  const isActive = fullPath === item.path
                    || (item.path === '/equipment' && location.pathname === '/equipment' && !location.search);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors relative ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
                      )}
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main Navbar ──────────────────────────────────────────────
export default function Navbar({ onOpenLiveScan, onToggleAiChat }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 shadow-sm'
            : 'bg-slate-900 border-b border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-[1700px] mx-auto gap-4">

          {/* ── LEFT: Hamburger + Logo ── */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <div className="flex items-center space-x-2">
                  <span className="font-bold tracking-wide text-[16px] text-white leading-none">
                    NEXORA
                  </span>
                  <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] px-1.5 py-0.5 rounded font-medium hidden lg:inline leading-none">
                    ENTERPRISE
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* ── CENTER: Status + Clock ── */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-3 bg-slate-800/50 border border-slate-700 px-4 py-1.5 rounded-full text-[12px] font-medium">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-300">System Online</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-300">Live Telemetry</span>
              </span>
            </div>
            <LiveClock />
          </div>

          {/* ── RIGHT: Action Buttons ── */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenLiveScan}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[12px] font-medium transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Health Scan</span>
            </button>

            <button
              onClick={onToggleAiChat}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[12px] font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Insights</span>
            </button>

            <Link
              to="/alerts"
              className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-slate-800" />
            </Link>

            <div className="flex items-center space-x-3 pl-3 border-l border-slate-800 ml-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[12px] font-medium text-slate-200 leading-tight">{user?.name || 'Admin User'}</span>
                <span className="text-[10px] text-slate-500 leading-tight">{user?.role || 'Operations'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
