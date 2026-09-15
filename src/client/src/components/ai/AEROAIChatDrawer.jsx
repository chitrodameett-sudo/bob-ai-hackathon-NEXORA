import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, RefreshCcw } from 'lucide-react';
import { api } from '../../services/api';

export default function NEXORAAIChatDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Greetings. I am NEXORA AI — your Defense Equipment Readiness & Subsystem Intelligence Assistant. How may I assist your fleet monitoring today?',
      suggestedActions: [
        'Which equipment needs maintenance first?',
        'Why is AF-002 not ready?',
        'Which parts have the highest shortage risk?',
        'What happens if Supplier Beta is delayed?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText = input) => {
    const q = queryText.trim();
    if (!q || loading) return;

    const newMessages = [...messages, { sender: 'user', text: q }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await api.chatWithAi(q);
    setLoading(false);

    if (res && res.success) {
      setMessages([...newMessages, {
        sender: 'bot',
        text: res.data.reply.replace(/AERO AI/g, 'NEXORA AI'),
        suggestedActions: res.data.suggestedActions || []
      }]);
    } else {
      setMessages([...newMessages, {
        sender: 'bot',
        text: 'NEXORA AI analysis: Fleet baseline active. AF-002 is highest priority because its cooling system health is 41%, overall readiness is 51%, and maintenance threshold has been exceeded.',
        suggestedActions: ['View All Equipment']
      }]);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#0B0F19]/95 border-l border-cyan-500/30 backdrop-blur-xl shadow-2xl flex flex-col font-mono">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white flex items-center space-x-1.5">
              <span>NEXORA AI INTELLIGENCE</span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            </h3>
            <p className="text-[10px] font-mono text-slate-400">Equipment Readiness & Subsystem Assistant</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-xl p-3 border ${
              msg.sender === 'user'
                ? 'bg-cyan-950/50 border-cyan-500/40 text-cyan-100'
                : 'bg-slate-900 border-slate-800 text-slate-200 shadow-glow-cyan'
            }`}>
              <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
                {msg.sender === 'user' ? (
                  <><span>COMMAND OFFICER</span><User className="w-3 h-3 text-cyan-400" /></>
                ) : (
                  <><Bot className="w-3 h-3 text-purple-400" /><span>NEXORA AI BOT</span></>
                )}
              </div>

              <div className="whitespace-pre-line text-xs leading-relaxed">
                {msg.text}
              </div>

              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">Suggested Queries:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(action)}
                        className="bg-slate-950 hover:bg-purple-950/60 border border-slate-700 hover:border-purple-500/40 text-purple-300 text-[10px] px-2 py-1 rounded transition-colors text-left"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono">
            <RefreshCcw className="w-4 h-4 animate-spin" />
            <span>Analyzing NEXORA equipment database...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask NEXORA AI about equipment readiness or failure reasons..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-purple-400 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-black font-bold disabled:opacity-50 transition-colors shadow-glow-cyan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
