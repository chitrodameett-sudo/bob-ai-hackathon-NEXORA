// NEXORA — Reusable RGB Page Header
// Usage: <PageHeader title="..." subtitle="..." icon={Icon} badge="LIVE" />

import React from 'react';

export default function PageHeader({ title, subtitle, icon: Icon, badge, badgeColor = 'cyan', children }) {
  const badgeColors = {
    cyan:    'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
    rose:    'bg-rose-500/15 border-rose-500/30 text-rose-400',
    amber:   'bg-amber-500/15 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    purple:  'bg-purple-500/15 border-purple-500/30 text-purple-400',
  };

  return (
    <div className="relative glass-panel rounded-xl overflow-hidden hud-grid border border-cyan-500/15 px-5 py-4 mb-5">
      {/* HUD corner marks */}
      <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-cyan-500/30" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-cyan-500/30" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-cyan-500/30" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-cyan-500/30" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-9 h-9 rounded-lg bg-slate-900 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-glow-cyan">
              <Icon className="w-4.5 h-4.5 text-cyan-400" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black font-orbitron text-white tracking-wide uppercase">
                {title}
              </h1>
              {badge && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${badgeColors[badgeColor] || badgeColors.cyan} animate-pulse`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[11px] text-slate-500 mt-0.5 font-jb">{subtitle}</p>
            )}
          </div>
        </div>

        {children && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
