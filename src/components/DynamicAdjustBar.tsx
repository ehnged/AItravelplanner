import React, { useState } from 'react';
import {
  CloudRain,
  BatteryLow,
  Zap,
  ClockAlert,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Radio,
  ShieldCheck,
} from 'lucide-react';

interface DynamicAdjustBarProps {
  onAdjust: (type: string, customPrompt?: string) => Promise<void>;
  isAdjusting: boolean;
  weatherAlertActive?: string;
  lastAdjustedReason?: string;
}

export const DynamicAdjustBar: React.FC<DynamicAdjustBarProps> = ({
  onAdjust,
  isAdjusting,
  weatherAlertActive,
  lastAdjustedReason,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedQuickType, setSelectedQuickType] = useState<string | null>(null);

  const quickScenarios = [
    {
      id: 'weather_rain',
      label: '🌧️ Heavy Rain Reroute',
      desc: 'Swap outdoor sights for indoor art museums & covered arcades',
      badge: 'AccuWeather Radar',
      borderClass: 'hover:border-blue-500',
    },
    {
      id: 'low_energy',
      label: '🥱 Low Energy / Slow Pace',
      desc: 'Insert relaxing tea breaks & scenic tranquil garden rests',
      badge: 'SmartTravel Care',
      borderClass: 'hover:border-amber-500',
    },
    {
      id: 'high_energy',
      label: '⚡ High Energy Boost',
      desc: 'Inject thrilling viewpoints, buzzing night markets & local bars',
      badge: 'Adventure',
      borderClass: 'hover:border-purple-500',
    },
    {
      id: 'delay_delay',
      label: '⏰ 3-Hour Delay Buffer',
      desc: 'Recalculate schedule & protect dinner reservation with Allianz',
      badge: 'Allianz Shield',
      borderClass: 'hover:border-rose-500',
    },
  ];

  const handleQuickTrigger = async (id: string) => {
    setSelectedQuickType(id);
    await onAdjust(id);
    setSelectedQuickType(null);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    await onAdjust('custom', customPrompt);
    setCustomPrompt('');
    setShowCustomInput(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-md mb-6">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700">
              <Radio className="w-4 h-4 animate-pulse text-blue-600" />
            </span>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              SmartTravel.com Dynamic Intelligence & Agile Journey Optimizer
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Canvas Feature
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Adapts your day on the fly based on live AccuWeather radar, sudden rainstorms, flight delays, or traveller energy levels.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {weatherAlertActive && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{weatherAlertActive}</span>
            </div>
          )}
          {lastAdjustedReason && !weatherAlertActive && (
            <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-300 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="line-clamp-1 max-w-xs">{lastAdjustedReason}</span>
            </div>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Allianz Trip Protection Connected</span>
          </div>
        </div>
      </div>

      {/* Quick Scenario Pills (Trip.com Clean Card Format) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {quickScenarios.map((sc) => {
          const isCurrentLoading = isAdjusting && selectedQuickType === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleQuickTrigger(sc.id)}
              disabled={isAdjusting}
              className={`group text-left p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all shadow-xs cursor-pointer relative overflow-hidden ${sc.borderClass} ${
                isCurrentLoading ? 'ring-2 ring-blue-500 bg-white' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                  {sc.label}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                  {sc.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {sc.desc}
              </p>
              {isCurrentLoading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center gap-1.5 text-xs text-blue-700 font-bold">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Re-optimizing itinerary...</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Situation Prompt Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Need an on-the-spot itinerary adjustment?</span>
        </div>

        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl transition font-bold cursor-pointer"
          >
            + Custom Real-Time Adjustment
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Toddler needs afternoon nap, craving ramen..."
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-full sm:w-80"
              disabled={isAdjusting}
            />
            <button
              type="submit"
              disabled={isAdjusting || !customPrompt.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition cursor-pointer disabled:opacity-50"
            >
              {isAdjusting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="text-xs text-slate-500 hover:text-slate-800 px-2 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
