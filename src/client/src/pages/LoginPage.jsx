import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('commander@nexora.mil');
  const [password, setPassword] = useState('password123');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handlePreset = (presetEmail) => {
    setEmail(presetEmail);
    setPassword('password123');
    login(presetEmail, 'password123').then(() => navigate('/dashboard'));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center font-mono p-4">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full border-cyan-500/30 space-y-6 shadow-glow-cyan">
        
        {/* Brand Logo -> NEXORA */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-glow-cyan">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-wider">NEXORA</h2>
          <p className="text-xs text-slate-400">Defense Equipment Readiness Intelligence Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Defense Email / Clearance ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-bold block">Access Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-white outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-glow-cyan"
          >
            <Lock className="w-4 h-4" />
            <span>AUTHENTICATE & LAUNCH</span>
          </button>
        </form>

        {/* Quick Demo Presets */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Hackathon Demo One-Click Login Presets:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePreset('commander@nexora.mil')}
              className="p-2 rounded bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[10px] text-left transition-colors"
            >
              <UserCheck className="w-3 h-3 text-cyan-400 inline mr-1" />
              Commander (Admin)
            </button>
            <button
              onClick={() => handlePreset('manager@nexora.mil')}
              className="p-2 rounded bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[10px] text-left transition-colors"
            >
              <UserCheck className="w-3 h-3 text-amber-400 inline mr-1" />
              Logistics Lead
            </button>
            <button
              onClick={() => handlePreset('analyst@nexora.mil')}
              className="p-2 rounded bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[10px] text-left transition-colors"
            >
              <UserCheck className="w-3 h-3 text-emerald-400 inline mr-1" />
              AI Analyst
            </button>
            <button
              onClick={() => handlePreset('viewer@nexora.mil')}
              className="p-2 rounded bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 text-cyan-300 text-[10px] text-left transition-colors"
            >
              <UserCheck className="w-3 h-3 text-slate-400 inline mr-1" />
              Guest Inspector
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
