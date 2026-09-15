import React from 'react';
import { BookOpen, Shield, Globe, Award, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function CaseStudiesPage() {
  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">GLOBAL DEFENSE RESILIENCE CASE STUDY</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Neutral Industrial Analysis of Procurement Scale & Supply Logistics</p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] px-3 py-1 rounded">
          PUBLIC SOURCE VERIFIED
        </div>
      </div>

      {/* Featured Case Study Card */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-6 hud-grid">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
              FEATURED CASE STUDY
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Case Study: Ukraine Support & Defense Supply Resilience
            </h2>
            <p className="text-xs text-slate-400">EU Support Loan Package • Industrial Sourcing & Logistics Lessons</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-cyan-400 block">€90 Billion</span>
            <span className="text-[10px] text-slate-400">Timeframe: 2026–2027</span>
          </div>
        </div>

        {/* Financial Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 block">BUDGETARY SUPPORT</span>
            <span className="text-3xl font-extrabold text-white">€30 Billion</span>
            <p className="text-[10px] text-slate-500">Economic and institutional stabilization support.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-glow-cyan space-y-1">
            <span className="text-xs text-cyan-400 font-bold block">DEFENSE-RELATED SUPPORT</span>
            <span className="text-3xl font-extrabold text-cyan-300">€60 Billion</span>
            <p className="text-[10px] text-slate-400">Equipment procurement, industrial capacity, maintenance, and supply-chain continuity.</p>
          </div>
        </div>

        {/* Key Takeaways & Explanation */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <h4 className="font-bold text-white uppercase text-xs flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>OPERATIONAL LESSON & INDUSTRIAL INSIGHT</span>
          </h4>
          <p className="text-slate-300 leading-relaxed text-xs">
            “Large-scale defense procurement demonstrates why production capacity, supplier networks, procurement speed, and depot logistics resilience matter. An equipment asset cannot achieve force availability without an uninterrupted flow of replacement components and skilled depot maintenance capacity.”
          </p>
        </div>

        {/* Source Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Source: European Union / European Commission (Official Release)</span>
          <span>Verified: 2026</span>
        </div>
      </div>
    </div>
  );
}
