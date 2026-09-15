import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Activity, Thermometer, Zap, Clock, Box, Truck, Cpu, ArrowLeft, Sparkles } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import Asset3DViewer from '../components/3d/Asset3DViewer';
import { api } from '../services/api';

export default function AssetDetailPage() {
  const { id } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAsset() {
      const res = await api.getAssetById(id || 'ASSET-101');
      if (res && res.success) {
        setAssetData(res.data);
      }
      setLoading(false);
    }
    loadAsset();
  }, [id]);

  const asset = assetData || {
    id: id || 'ASSET-107',
    name: 'Tactical Recon Transport VEH-107',
    type: 'Ground Vehicle',
    status: 'AT_RISK',
    healthScore: 82,
    readinessScore: 61,
    partsAvailability: 55,
    supplierRiskScore: 68,
    telemetry: { temperature: 72, vibration: 2.1, operatingHours: 1950, nextMaintenanceWindowDays: 4 },
    history: [
      { timestamp: 'Day -6', healthScore: 88, temperature: 65, vibration: 1.4, readinessScore: 78 },
      { timestamp: 'Day -5', healthScore: 87, temperature: 66, vibration: 1.5, readinessScore: 75 },
      { timestamp: 'Day -4', healthScore: 85, temperature: 68, vibration: 1.7, readinessScore: 71 },
      { timestamp: 'Day -3', healthScore: 84, temperature: 70, vibration: 1.9, readinessScore: 68 },
      { timestamp: 'Day -2', healthScore: 83, temperature: 71, vibration: 2.0, readinessScore: 64 },
      { timestamp: 'Day -1', healthScore: 82, temperature: 72, vibration: 2.1, readinessScore: 61 }
    ],
    timeline: [
      { event: 'Initial Commissioning', date: '2024-02-10', status: 'COMPLETED' },
      { event: 'Field Logistics Deployment', date: '2024-05-18', status: 'COMPLETED' },
      { event: 'Hydraulic Swivel Overhaul', date: '2025-11-04', status: 'COMPLETED' },
      { event: 'Current Telemetry Monitoring', date: 'Present', status: 'ACTIVE' },
      { event: 'Predicted Component Overhaul Window', date: 'In 4 days', status: 'SCHEDULED' }
    ],
    aiDiagnosis: {
      reasons: [
        { factor: 'Critical Part Availability', severity: 'CRITICAL', description: 'Hydraulic logic manifold stock level is low with high supplier lead time (37 days).' },
        { factor: 'Supplier Disruption Risk', severity: 'HIGH', description: 'Upstream vendor (Apex Avionics) reports lead time expansion.' }
      ],
      aiRecommendation: 'Prioritize inspection of ASSET-107 and verify allocation of replacement components. Activate alternate tier-2 regional supplier.'
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Back Link & Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/dashboard" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300">
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white uppercase">{asset.id} — {asset.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                asset.status === 'AT_RISK' ? 'border-rose-500/60 text-rose-400 bg-rose-950/40' : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
              }`}>
                {asset.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Asset Type: {asset.type} • Telemetry Matrix</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-extrabold text-cyan-400 block">{asset.readinessScore}%</span>
          <span className="text-[10px] text-slate-400">READINESS SCORE</span>
        </div>
      </div>

      {/* Main Grid: 3D Twin & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Asset3DViewer assetType={asset.type} assetHealth={asset.healthScore} />

          {/* Historical Telemetry Chart */}
          <div className="glass-panel p-5 rounded-xl space-y-3 hud-grid">
            <h3 className="text-xs font-bold text-white uppercase border-b border-slate-800 pb-2">
              TELEMETRY & READINESS HISTORICAL TREND
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={asset.history}>
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} />
                  <YAxis domain={[40, 100]} stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#06b6d4', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="readinessScore" name="Readiness %" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="healthScore" name="Health %" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Sidebar: AI Diagnosis & Subsystem Factors */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          <div className="glass-panel p-5 rounded-xl space-y-4 hud-grid">
            <h3 className="font-bold text-white uppercase text-xs border-b border-slate-800 pb-2 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI READINESS DIAGNOSIS</span>
            </h3>

            {/* Reasons List */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Why is this asset at risk?</span>
              {asset.aiDiagnosis?.reasons?.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-rose-400 font-bold text-[11px] block">{r.factor} ({r.severity})</span>
                  <p className="text-slate-300 text-[11px] leading-tight">{r.description}</p>
                </div>
              ))}
            </div>

            {/* AI Recommendation */}
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-1">
              <span className="text-cyan-400 font-bold text-[10px] block uppercase">AI RECOMMENDED ACTION</span>
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {asset.aiDiagnosis?.aiRecommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
