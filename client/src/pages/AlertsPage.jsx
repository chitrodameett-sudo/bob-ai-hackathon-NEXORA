import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, Bell, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';
import { formatDate } from '../utils/formatters';
import PageHeader from '../components/common/PageHeader';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      const res = await api.getAlerts(severityFilter);
      if (res && res.success) {
        setAlerts(res.data);
      }
      setLoading(false);
    }
    loadAlerts();
  }, [severityFilter]);

  const getAlertBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-rose-500/60 text-rose-400 bg-rose-950/40 shadow-glow-rose';
      case 'WARNING':
        return 'border-amber-500/50 text-amber-400 bg-amber-950/30 shadow-glow-amber';
      case 'WATCH':
        return 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20';
      default:
        return 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20';
    }
  };

  return (
    <div className="space-y-5 pb-12 font-jb">
      <PageHeader
        title="AI ALERT CENTER"
        subtitle="Autonomous Multi-Signal Threat & Anomaly Monitoring"
        icon={Bell}
        badge="LIVE"
      >
        <div className="flex items-center gap-1.5">
          {['ALL', 'CRITICAL', 'WARNING', 'WATCH', 'NORMAL'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all btn-cyber ${
                severityFilter === sev
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className="glass-panel p-4 rounded-xl border flex items-start justify-between space-x-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getAlertBadge(a.severity)}`}>
                  {a.severity}
                </span>
                <h4 className="font-bold text-white text-xs">{a.title}</h4>
              </div>
              <p className="text-slate-300 text-xs">{a.message}</p>
              <span className="text-[10px] text-slate-500 block">{formatDate(a.timestamp)}</span>
            </div>

            <button className="text-[10px] text-cyan-400 border border-cyan-500/30 hover:bg-cyan-950/40 px-3 py-1 rounded transition-colors whitespace-nowrap">
              Acknowledge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
