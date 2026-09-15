import React, { useState, useEffect } from 'react';
import { Newspaper, Shield, ExternalLink, Globe, AlertTriangle, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function IntelligencePage() {
  const [news, setNews] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function loadData() {
      const newsRes = await api.getNews();
      if (newsRes && newsRes.success) setNews(newsRes.data);

      const chalRes = await api.getChallenges();
      if (chalRes && chalRes.success) setChallenges(chalRes.challenges);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12 font-mono">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight uppercase">GLOBAL AEROSPACE & DEFENSE INTELLIGENCE</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Industry News, Disruption Bulletins & Structural Challenges</p>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] px-3 py-1 rounded">
          DEMO & PUBLIC FEEDS ACTIVE
        </div>
      </div>

      {/* News Feed Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase border-b border-slate-800 pb-2">
          INDUSTRY PULSE & DISRUPTION BULLETINS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map(item => (
            <div key={item.id} className="glass-panel p-5 rounded-xl space-y-3 border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                  {item.category}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  item.impact === 'HIGH' ? 'border-rose-500/50 text-rose-400 bg-rose-950/30' : 'border-amber-500/50 text-amber-400 bg-amber-950/30'
                }`}>
                  {item.impact} IMPACT
                </span>
              </div>

              <h4 className="font-bold text-white text-sm leading-snug">{item.headline}</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{item.summary}</p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Source: {item.source}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Static Defense Challenges */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold text-white uppercase border-b border-slate-800 pb-2">
          STRUCTURAL AEROSPACE & DEFENSE CHALLENGES
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map(c => (
            <div key={c.id} className="glass-panel p-4 rounded-xl space-y-2">
              <span className="text-cyan-400 text-xs font-bold uppercase block">{c.title}</span>
              <p className="text-slate-300 text-xs leading-relaxed">{c.summary}</p>
              <div className="text-[10px] text-slate-500 pt-1 font-bold">
                KEY BOTTLENECK: <span className="text-slate-300">{c.keyFactor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
