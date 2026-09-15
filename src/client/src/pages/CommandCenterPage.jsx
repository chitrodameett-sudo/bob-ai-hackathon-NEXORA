import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Activity, AlertTriangle, Wrench,
  Box, Cpu, Sparkles, ArrowUpRight,
  CheckCircle2, AlertCircle, Plane, Truck,
  Radar, Anchor, Zap, ArrowRight,
  TrendingUp, Database, Network, Sliders
} from 'lucide-react';
import { api } from '../services/api';

// ── Animated counter hook ────────────────────────────────────
function useCountUp(target, duration = 1500, active = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return val;
}

// ── KPI Counter Card ─────────────────────────────────────────
function KpiCounter({ label, value, suffix = '', color, glowClass, icon: Icon, delay = 0 }) {
  const [active, setActive] = useState(false);
  const animated = useCountUp(value, 1400, active);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className={`glass-panel p-4 rounded-xl border card-rgb-hover group animate-fade-up`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{label}</span>
        <Icon className={`w-3.5 h-3.5 ${color} group-hover:scale-125 transition-transform`} />
      </div>
      <div className={`text-2xl font-black font-orbitron ${color} ${glowClass} tabular-nums leading-none`}>
        {animated.toLocaleString()}{suffix}
      </div>
    </div>
  );
}

// ── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, to, color, bgGlow, badge, delay = 0 }) {
  return (
    <Link
      to={to}
      className="group relative glass-panel p-5 rounded-xl border card-rgb-hover block overflow-hidden animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Corner HUD marks */}
      <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-cyan-500/30 group-hover:border-cyan-400/60 transition-colors" />

      {/* Background glow */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${bgGlow}`} />

      <div className="relative space-y-3">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-cyan-500/40 transition-all`}>
          <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
        </div>

        {badge && (
          <span className="absolute top-0 right-0 text-[8px] font-black px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 uppercase">
            {badge}
          </span>
        )}

        <div>
          <h3 className="text-sm font-black text-white font-orbitron tracking-wide group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>

        <div className={`flex items-center space-x-1 text-[10px] font-bold ${color} opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 duration-300`}>
          <span>OPEN MODULE</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}

// ── Category Tile ─────────────────────────────────────────────
function CategoryTile({ category, count, readiness, icon: Icon, to, delay = 0 }) {
  const readinessColor =
    readiness >= 90 ? 'text-emerald-400' :
    readiness >= 75 ? 'text-cyan-400' :
    readiness >= 60 ? 'text-amber-400' : 'text-rose-400';

  return (
    <Link
      to={to}
      className="glass-panel p-3 rounded-xl card-rgb-hover block group animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider truncate">{category}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-lg font-black text-white font-orbitron">{count}</span>
        <span className={`text-[9px] font-black ${readinessColor}`}>{readiness}% RDY</span>
      </div>
      {/* Readiness bar */}
      <div className="mt-2 w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            readiness >= 90 ? 'bg-emerald-400' : readiness >= 75 ? 'bg-cyan-400' : readiness >= 60 ? 'bg-amber-400' : 'bg-rose-400'
          }`}
          style={{ width: `${readiness}%` }}
        />
      </div>
    </Link>
  );
}

// ── Critical Alert Row ────────────────────────────────────────
function CriticalRow({ id, name, health, problem, delay = 0 }) {
  return (
    <Link
      to={`/equipment/${id}`}
      className="flex items-center justify-between px-4 py-3 rounded-xl bg-rose-950/20 border border-rose-500/25 hover:border-rose-500/50 hover:bg-rose-950/30 transition-all group animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse flex-shrink-0" />
        <div>
          <span className="text-xs font-black text-white">{id}</span>
          <span className="text-xs text-slate-500 ml-2">{name}</span>
          <p className="text-[9px] text-amber-400/80 mt-0.5">{problem}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-black text-rose-400">{health}%</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-rose-500 group-hover:text-rose-300 transition-colors" />
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function CommandCenterPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await api.getDashboard();
      if (data?.success) setDashboardData(data);
      setLoaded(true);
    }
    loadData();
  }, []);

  const kpis = dashboardData?.kpis || {
    totalAssets: 1248, ready: 986, maintenance: 174, critical: 27, overallReadiness: 87
  };

  const categoryCards = [
    { category: 'AIRCRAFT',         count: 320, readiness: 91, icon: Plane,   to: '/equipment?cat=Aircraft' },
    { category: 'ARMORED VEHICLES', count: 285, readiness: 83, icon: Shield,  to: '/equipment?cat=Armored Vehicles' },
    { category: 'GROUND VEHICLES',  count: 410, readiness: 89, icon: Truck,   to: '/equipment?cat=Ground Vehicles' },
    { category: 'AIR DEFENSE',      count: 96,  readiness: 94, icon: Radar,   to: '/equipment?cat=Air Defense' },
    { category: 'NAVAL SYSTEMS',    count: 72,  readiness: 86, icon: Anchor,  to: '/equipment?cat=Naval Systems' },
    { category: 'SUPPORT SYSTEMS',  count: 65,  readiness: 88, icon: Zap,     to: '/equipment?cat=Support Systems' },
  ];

  const featureCards = [
    {
      icon: Cpu,
      title: 'DIGITAL TWIN',
      description: '3D equipment models with live component health overlays and real-time telemetry streams.',
      to: '/equipment',
      color: 'text-cyan-400',
      bgGlow: 'bg-cyan-500',
      badge: 'LIVE',
    },
    {
      icon: Wrench,
      title: 'MAINTENANCE',
      description: 'Predictive maintenance queue with AI-prioritized work orders across all fleet categories.',
      to: '/maintenance',
      color: 'text-amber-400',
      bgGlow: 'bg-amber-500',
    },
    {
      icon: Network,
      title: 'SUPPLY CHAIN',
      description: 'Interactive supplier dependency graph tracing tier-1/2 risk propagation and disruptions.',
      to: '/supply-chain',
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500',
    },
    {
      icon: Sliders,
      title: 'RESILIENCE SIM',
      description: 'Stress-test disruption scenarios before they impact force availability in real ops.',
      to: '/simulator',
      color: 'text-purple-400',
      bgGlow: 'bg-purple-500',
      badge: 'AI',
    },
    {
      icon: Database,
      title: 'PARTS & STOCK',
      description: 'Real-time inventory levels, reorder alerts, and spare parts shortage analysis.',
      to: '/inventory',
      color: 'text-blue-400',
      bgGlow: 'bg-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'AI INSIGHTS',
      description: 'NEXORA AI-generated operational intelligence reports and readiness risk forecasts.',
      to: '/intelligence',
      color: 'text-pink-400',
      bgGlow: 'bg-pink-500',
      badge: 'NEW',
    },
  ];

  return (
    <div className="space-y-6 pb-12 font-jb matrix-bg min-h-screen">

      {/* ── HERO HEADER ── */}
      <div className="relative glass-panel rounded-2xl overflow-hidden hud-grid-rgb scanline-overlay border border-cyan-500/20 p-6">
        {/* Corner HUD decorations */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400/40" />
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-400/40" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cyan-400/40" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400/40" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl sm:text-2xl font-black font-orbitron text-white tracking-widest animate-rgb-text">
                NEXORA COMMAND CENTER
              </h1>
              <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] px-2 py-0.5 rounded font-black hidden sm:inline animate-pulse">
                SYSTEM ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Real-Time Defense &amp; Aerospace Equipment Telemetry &amp; Readiness Intelligence
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-cyan-500/25 px-3 py-1.5 rounded-lg text-[10px]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-bold">LIVE DEMO TELEMETRY STREAM</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI STRIP ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
        <KpiCounter label="TOTAL FLEET ASSETS"   value={kpis.totalAssets}    icon={Shield}        color="text-white"       glowClass=""                  delay={0} />
        <KpiCounter label="FORCE READY"          value={kpis.ready}          icon={CheckCircle2}  color="text-emerald-400" glowClass="text-glow-emerald"  delay={100} />
        <KpiCounter label="NEEDS MAINTENANCE"    value={kpis.maintenance || kpis.underMaintenance || 174} icon={Wrench} color="text-amber-400" glowClass="text-glow-amber" delay={200} />
        <KpiCounter label="CRITICAL — NOT READY" value={kpis.critical}       icon={AlertTriangle} color="text-rose-400"    glowClass="text-glow-rose"    delay={300} />
      </div>

      {/* ── CATEGORY TILES ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet Categories</span>
          <Link to="/equipment" className="flex items-center space-x-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            <span>View All</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {categoryCards.map((cat, i) => (
            <CategoryTile key={cat.category} {...cat} delay={i * 60} />
          ))}
        </div>
      </div>

      {/* ── FEATURE CARDS GRID ── */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <span className="text-[10px] font-black text-cyan-500/70 uppercase tracking-widest px-3">Platform Modules</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-500/30 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card, i) => (
            <FeatureCard key={card.title} {...card} delay={i * 80} />
          ))}
        </div>
      </div>

      {/* ── BOTTOM ROW: Readiness + Critical Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Fleet Readiness Score */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-cyan-500/20 space-y-4 animate-fade-up">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Readiness Index</span>
          </div>

          {/* Big readiness number */}
          <div className="text-center py-4 space-y-2">
            <div className="text-6xl font-black font-orbitron text-cyan-400 text-glow-cyan animate-flicker tabular-nums">
              {kpis.overallReadiness}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Overall Fleet Readiness</div>
            {/* Arc bar */}
            <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden mt-2">
              <div
                className="h-full progress-rgb rounded-full transition-all duration-2000"
                style={{ width: `${kpis.overallReadiness}%` }}
              />
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center space-x-2 text-purple-400 text-[10px] font-black mb-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>NEXORA AI DIAGNOSIS</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Fleet readiness at <span className="text-cyan-400 font-bold">{kpis.overallReadiness}%</span>.
              Equipment <span className="text-rose-400 font-bold">AF-002</span> requires immediate attention —
              cooling subsystem thermal anomaly at 41% health.
            </p>
          </div>
        </div>

        {/* Critical Equipment Alerts */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-xl border border-rose-500/15 space-y-3 animate-fade-up" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Critical Equipment</span>
              <span className="bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-black px-1.5 py-0.5 rounded">
                {kpis.critical} UNITS
              </span>
            </div>
            <Link
              to="/equipment?status=CRITICAL"
              className="flex items-center space-x-1 text-[10px] font-black text-rose-400 hover:text-rose-300 transition-colors"
            >
              <span>VIEW ALL</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            <CriticalRow id="AF-002" name="Falcon-A2"    health={68} problem="Cooling System thermal anomaly — 41% health"    delay={0} />
            <CriticalRow id="AV-002" name="Armored-X2"  health={57} problem="Transmission drivetrain bearing failure — 48%"   delay={80} />
            <CriticalRow id="GV-002" name="Logistics-X2" health={74} problem="Electrical harness insulation breach — 62%"      delay={160} />
          </div>

          <div className="pt-1 grid grid-cols-3 gap-2 text-center text-[9px]">
            <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
              <div className="text-emerald-400 font-black text-base font-orbitron">{kpis.ready}</div>
              <div className="text-slate-600 uppercase font-bold mt-0.5">READY</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/20">
              <div className="text-amber-400 font-black text-base font-orbitron">{kpis.maintenance || 174}</div>
              <div className="text-slate-600 uppercase font-bold mt-0.5">MAINTENANCE</div>
            </div>
            <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20">
              <div className="text-rose-400 font-black text-base font-orbitron">{kpis.critical}</div>
              <div className="text-slate-600 uppercase font-bold mt-0.5">CRITICAL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
