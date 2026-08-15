import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { AIMealChatMessage, HealthProfile } from '../types';

interface AIMealAssistantCardProps {
  messages: AIMealChatMessage[];
  healthProfile: HealthProfile;
  onSendMessage: (text: string) => void;
}

const PRESET_QUESTIONS = [
  'Can I eat this before my flight?',
  'Is standard vegetarian meal suitable for diabetes?',
  'Does Gate 18 cafe serve lactose-free yogurt?',
  'What should I eat during a 3-hour layover?',
];

export default function AIMealAssistantCard({
  messages,
  healthProfile,
  onSendMessage,
}: AIMealAssistantCardProps) {
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const txt = textToSend || inputText;
    if (!txt.trim()) return;
    onSendMessage(txt.trim());
    setInputText('');
  };

  return (
    <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>AI Meal & Health Assistant</span>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
                <Sparkles size={10} /> Active AI Model
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized dietary guidance tailored to your health profile
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap gap-2 pt-1">
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[11px] bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/8 transition-all flex items-center gap-1"
          >
            <Sparkles size={11} className="text-purple-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isUser ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                }`}
              >
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs space-y-2 ${
                  isUser
                    ? 'bg-blue-600/25 border border-blue-500/40 text-white rounded-tr-none'
                    : 'bg-[#0d1628] border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>

                {msg.badge === 'CAUTION' && (
                  <div className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                    <AlertTriangle size={11} /> High Glycemic / Lactose Caution
                  </div>
                )}

                {msg.suggestedItems && msg.suggestedItems.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <span className="text-[10px] text-purple-300 font-bold">Suggested AI Recommendations:</span>
                    <div className="flex flex-wrap gap-1">
                      {msg.suggestedItems.map((item, i) => (
                        <span key={i} className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded border border-purple-500/30">
                          • {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Box */}
      <div className="relative pt-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI about food, ingredients, or flight meals..."
          className="w-full bg-[#0d1628] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-400 outline-none focus:border-purple-500 transition-all"
        />
        <button
          onClick={() => handleSend()}
          className="absolute right-2 top-3.5 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors shadow-md"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
