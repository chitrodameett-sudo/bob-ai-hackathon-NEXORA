import React from 'react';
import { Shield, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/10 bg-[#020409]/95 py-4 px-4 text-xs font-jb text-slate-500 overflow-hidden">
      {/* RGB bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] animate-rgb-border" />

      <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-cyan-500" />
            <span className="text-white font-black font-orbitron tracking-widest text-sm">NEXORA</span>
          </div>
          <span className="text-slate-700">•</span>
          <span className="text-slate-600 hidden sm:inline">Predict. Prepare. Protect.</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold">SIMULATION MODE</span>
          </div>
          <span className="text-[10px] text-slate-600 hidden md:inline">
            IBM Hackathon Prototype — Synthetic demo datasets only
          </span>
        </div>
      </div>
    </footer>
  );
}
