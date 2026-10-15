import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Coins,
  Compass,
  PhoneCall,
  Languages,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  CalendarCheck,
} from 'lucide-react';
import { DestinationMustKnows, TravelAdvisory, PreTripFollowUp } from '../types/travel.ts';

interface DestinationEssentialsProps {
  destination: string;
  mustKnows: DestinationMustKnows;
  advisory: TravelAdvisory;
  followUps: PreTripFollowUp[];
  onToggleFollowUp: (id: string) => void;
}

export const DestinationEssentials: React.FC<DestinationEssentialsProps> = ({
  destination,
  mustKnows,
  advisory,
  followUps,
  onToggleFollowUp,
}) => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Advisory Banner (SmartTravel Singapore Travel Advisories) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Official Travel Advisory: {destination}
                </h2>
                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black">
                  {advisory.safetyRating}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified with Singapore MFA, Ministry of Transport & National Tourism Bureau
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" /> Situation & Visa Entry
            </h4>
            <p className="text-slate-600 leading-relaxed mb-2">{advisory.overallStatus}</p>
            <p className="text-slate-500"><strong className="text-slate-800">Entry Rules:</strong> {advisory.entryRequirements}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Live Partner Alerts (AccuWeather / Tourism)
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              {advisory.recentAlerts.map((alert, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Grid of Destination Must-Knows (Canvas Page 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Customs & Etiquette */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-600">
            <Compass className="w-5 h-5" />
            <h3 className="font-extrabold text-slate-900 text-base">Customs & Etiquette</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-800">Local Customs:</p>
            <ul className="space-y-1 list-disc list-inside text-slate-500 mb-3">
              {mustKnows.customs.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
            <p className="font-bold text-slate-800">Key Etiquette:</p>
            <ul className="space-y-1 list-disc list-inside text-slate-500">
              {mustKnows.etiquette.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Currency, Payment & Tipping */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-emerald-600">
            <Coins className="w-5 h-5" />
            <h3 className="font-extrabold text-slate-900 text-base">Currency & Payment</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Currency:</span>
              <p className="font-black text-slate-900 text-sm mt-0.5">
                {mustKnows.currency.name} ({mustKnows.currency.code})
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Cash vs Card:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{mustKnows.currency.cashVsCard}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Tipping Norms:</span>
              <p className="text-blue-700 font-bold mt-0.5">{mustKnows.currency.tippingStandard}</p>
            </div>
          </div>
        </div>

        {/* Power Plugs & Transit Guide */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-blue-600">
            <Zap className="w-5 h-5" />
            <h3 className="font-extrabold text-slate-900 text-base">Plugs & Transit</h3>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Power Plug & Voltage:</span>
              <p className="font-bold text-slate-900 mt-0.5">{mustKnows.powerPlug.type} • {mustKnows.powerPlug.voltage}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Public Transit:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{mustKnows.localTransitGuide}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Transit Pass in Wallet:</span>
              <span className="text-emerald-700 font-bold">Active & Synced</span>
            </div>
          </div>
        </div>

        {/* Emergency Hotlines */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-rose-600">
            <PhoneCall className="w-5 h-5" />
            <h3 className="font-extrabold text-slate-900 text-base">Emergency Services</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Police:</span>
              <span className="font-mono font-bold text-rose-600 text-sm">{mustKnows.emergencyContacts.police}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600">Ambulance / Fire:</span>
              <span className="font-mono font-bold text-rose-600 text-sm">{mustKnows.emergencyContacts.ambulance}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[11px] block">24/7 Tourist Support Bureau:</span>
              <span className="font-mono font-bold text-blue-700">{mustKnows.emergencyContacts.touristHotline}</span>
            </div>
          </div>
        </div>

        {/* Local Phrases & Translations */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs md:col-span-2">
          <div className="flex items-center gap-2 mb-3 text-indigo-600">
            <Languages className="w-5 h-5" />
            <h3 className="font-extrabold text-slate-900 text-base">Essential Local Phrases</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {mustKnows.languageTips.map((tip, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-extrabold text-slate-900 text-sm">{tip.phrase}</p>
                <p className="text-blue-700 font-bold mt-0.5">{tip.translation}</p>
                <p className="text-[11px] text-slate-500 mt-1 italic">{tip.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Trip Automated Follow-Up Checklist (Canvas Page 4) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Automated Pre-Trip Milestones & Check-in Reminders
              </h3>
              <p className="text-xs text-slate-500">
                Triggered automatically closer to departure (Passport check, airline check-in, weather sync, packing alerts)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {followUps.map((fu) => {
            const isDone = fu.status === 'completed';
            return (
              <div
                key={fu.id}
                onClick={() => onToggleFollowUp(fu.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isDone
                    ? 'bg-slate-50 border-emerald-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-blue-700 text-[11px] uppercase tracking-wider">
                      {fu.timing}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                      {fu.category}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {fu.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {fu.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
