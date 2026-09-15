import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

export default function ReadinessGauge({ readinessScore = 87, label = "OVERALL FLEET READINESS" }) {
  const getScoreColor = (score) => {
    if (score >= 85) return { stroke: '#10b981', text: 'text-emerald-400', glow: 'shadow-glow-emerald', label: 'OPTIMAL READINESS' };
    if (score >= 70) return { stroke: '#f59e0b', text: 'text-amber-400', glow: 'shadow-glow-amber', label: 'ELEVATED RISK' };
    return { stroke: '#f43f5e', text: 'text-rose-400', glow: 'shadow-glow-rose', label: 'CRITICAL READINESS' };
  };

  const style = getScoreColor(readinessScore);
  const strokeDashoffset = 283 - (283 * readinessScore) / 100;

  return (
    <div className="glass-panel p-5 rounded-xl flex flex-col items-center justify-center relative hud-grid">
      <div className="absolute top-3 left-3 flex items-center space-x-1.5 text-[10px] font-mono text-cyan-400">
        <Activity className="w-3.5 h-3.5 animate-pulse" />
        <span>READINESS INTELLIGENCE ENGINE</span>
      </div>

      <div className="relative my-4 flex items-center justify-center">
        {/* SVG Circular Ring */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="45"
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke={style.stroke}
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold font-mono ${style.text}`}>
            {readinessScore}%
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">READINESS</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <div className={`inline-block px-2.5 py-0.5 rounded border border-current text-[10px] font-mono font-bold ${style.text}`}>
          {style.label}
        </div>
        <p className="text-[11px] font-mono text-slate-400">{label}</p>
        <p className="text-[9px] font-mono text-slate-500 max-w-xs">
          Score = Health (35%) + Parts (25%) + Maint (15%) + Supplier (15%) + Capacity (10%)
        </p>
      </div>
    </div>
  );
}
