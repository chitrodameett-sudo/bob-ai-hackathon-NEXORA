import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Activity, ArrowRight, CheckCircle2, AlertTriangle, Layers, Zap, Sliders, Globe } from 'lucide-react';
import Asset3DViewer from '../components/3d/Asset3DViewer';

export default function LandingPage() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 px-4 glass-panel rounded-2xl border border-cyan-500/20 hud-grid overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-mono text-cyan-400">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>NEXT-GEN DEFENSE & AEROSPACE PLATFORM</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight leading-none">
                AEROVIGIL
              </h1>
              <p className="text-xl font-mono text-cyan-400 font-semibold tracking-wide">
                “Predict. Prepare. Protect.”
              </p>
            </div>

            <p className="text-sm font-mono text-slate-300 leading-relaxed">
              AI-powered readiness & supply resilience intelligence for defense & aerospace operations. Connecting equipment telemetry, maintenance queues, spare part stock, supplier lead times, and external disruptions into one unified <span className="text-cyan-300 font-bold">Digital Readiness Twin</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-extrabold text-sm flex items-center space-x-2 transition-all shadow-glow-cyan"
              >
                <Activity className="w-4 h-4" />
                <span>LAUNCH COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                to="/digital-twin"
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-slate-200 font-mono font-bold text-sm flex items-center space-x-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>EXPLORE DIGITAL TWIN</span>
              </Link>
            </div>

            {/* Quick Metrics Badge Bar */}
            <div className="pt-4 grid grid-cols-3 gap-3 font-mono text-xs text-slate-400 border-t border-slate-800">
              <div>
                <span className="text-white font-extrabold text-lg block">52</span>
                <span>Fleet Assets Monitored</span>
              </div>
              <div>
                <span className="text-cyan-400 font-extrabold text-lg block">87%</span>
                <span>Overall Fleet Readiness</span>
              </div>
              <div>
                <span className="text-emerald-400 font-extrabold text-lg block">20</span>
                <span>Supplier Nodes Analyzed</span>
              </div>
            </div>
          </div>

          {/* Right Hero 3D Digital Twin Visual */}
          <div className="lg:col-span-6 space-y-3">
            <Asset3DViewer assetType="Aircraft" assetHealth={92} />

            {/* Telemetry overlay cards */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Turbine Propulsion:</span>
                <span className="text-emerald-400 font-bold">94% HEALTH</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Critical Part Lead:</span>
                <span className="text-amber-400 font-bold">14 DAYS</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Prominent Key Differentiator Banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border border-cyan-500/30 text-center font-mono space-y-2 shadow-glow-cyan">
        <p className="text-xs text-cyan-400 uppercase tracking-widest font-bold">KEY INNOVATION DIFFERENTIATOR</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
          “We don't just predict failure. We predict readiness risk.”
        </h2>
        <p className="text-xs text-slate-300 max-w-2xl mx-auto">
          From component health telemetry to upstream supply-chain disruptions — one intelligent, unified operational view.
        </p>
      </section>

      {/* Problem Story Breakdown Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-mono text-white">THE CORE DEFENSE READINESS PROBLEM</h2>
          <p className="text-xs font-mono text-slate-400 max-w-2xl mx-auto">
            Defense assets can be 100% technically healthy but still unavailable due to supply chain delays, parts shortages, or depot capacity bottlenecks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center font-mono text-xs">
          <div className="p-4 rounded-xl glass-panel text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-white">Healthy Equipment</h4>
            <p className="text-[10px] text-slate-400">Asset Health 92%</p>
          </div>

          <div className="text-center text-slate-500 font-bold">↓</div>

          <div className="p-4 rounded-xl glass-panel text-center space-y-1 border-amber-500/30">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-white">Missing Component</h4>
            <p className="text-[10px] text-slate-400">Stock Below Threshold</p>
          </div>

          <div className="text-center text-slate-500 font-bold">↓</div>

          <div className="p-4 rounded-xl glass-panel text-center space-y-1 border-rose-500/40">
            <Activity className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="font-bold text-rose-300">Reduced Readiness</h4>
            <p className="text-[10px] text-slate-400">Readiness Score Drops to 61%</p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="glass-panel p-5 rounded-xl space-y-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Digital Readiness Twin</h3>
          <p className="text-xs text-slate-400">
            Multi-variable readiness scoring combining equipment health, part availability, maintenance status, supplier risk, and workforce capacity.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-2">
          <Sliders className="w-6 h-6 text-amber-400" />
          <h3 className="text-base font-bold text-white">What-If Resilience Simulator</h3>
          <p className="text-xs text-slate-400">
            Stress-test external disruptions like supplier delays, raw material shortages, and workforce reductions before they impact force availability.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl space-y-2">
          <Globe className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Supply Chain Control Tower</h3>
          <p className="text-xs text-slate-400">
            Interactive node dependency graph tracing downstream asset impact propagation across tier-1/2 defense suppliers.
          </p>
        </div>
      </section>
    </div>
  );
}
