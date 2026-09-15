import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'cyan', trend }) {
  const colorStyles = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-glow-cyan',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-glow-amber',
    rose: 'border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-glow-rose',
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
  };

  return (
    <div className="glass-panel glass-panel-hover p-4 rounded-xl relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold font-mono text-white mt-1">{value}</h3>
          {subtitle && <p className="text-[10px] font-mono text-slate-400 mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${colorStyles[color] || colorStyles.cyan}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.isPositive ? '▲' : '▼'} {trend.value}
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
