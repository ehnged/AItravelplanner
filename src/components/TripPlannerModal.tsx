import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Briefcase,
  X,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { BudgetTier, TravelPersona } from '../types/travel.ts';

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGeneratePlan: (params: {
    destination: string;
    durationDays: number;
    budgetTier: BudgetTier;
    persona: TravelPersona;
    travelers: string;
    vibeTags: string[];
    notes?: string;
  }) => Promise<void>;
  isGenerating: boolean;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen,
  onClose,
  onGeneratePlan,
  isGenerating,
}) => {
  const [destination, setDestination] = useState('Tokyo, Japan');
  const [durationDays, setDurationDays] = useState(4);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('moderate');
  const [persona, setPersona] = useState<TravelPersona>('busy_pmet');
  const [travelers, setTravelers] = useState('Solo Traveler');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([
    'Culinary & Street Food',
    'Cultural Heritage',
    'Photography Hotspots',
  ]);
  const [notes, setNotes] = useState('');
  const [generationStep, setGenerationStep] = useState(0);

  if (!isOpen) return null;

  const popularDestinations = [
    { name: 'Tokyo, Japan', label: 'Tokyo', flag: '🇯🇵' },
    { name: 'Paris, France', label: 'Paris', flag: '🇫🇷' },
    { name: 'Bali, Indonesia', label: 'Bali', flag: '🇮🇩' },
    { name: 'Swiss Alps, Switzerland', label: 'Swiss Alps', flag: '🇨🇭' },
    { name: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { name: 'Rome, Italy', label: 'Rome', flag: '🇮🇹' },
    { name: 'Reykjavik, Iceland', label: 'Reykjavik', flag: '🇮🇸' },
  ];

  const personasList: { id: TravelPersona; label: string; desc: string }[] = [
    {
      id: 'busy_pmet',
      label: 'Busy PMET',
      desc: 'High efficiency, stress-free curation, bleisure spots & work-friendly spaces',
    },
    {
      id: 'avid_traveller',
      label: 'Avid Explorer',
      desc: 'Deep discovery, hidden gems, local culture & unique photo spots',
    },
    {
      id: 'bargain_hunter',
      label: 'Bargain Hunter',
      desc: 'Maximum value, partner discount passes, free walking tours & authentic street eats',
    },
    {
      id: 'beginner_planner',
      label: 'First-Time Planner',
      desc: 'Guided step-by-step assistance, clear transit instructions & reassuring advice',
    },
    {
      id: 'corporate_retreat',
      label: 'Corporate / Team Bleisure',
      desc: 'Group dining, team activities, meeting-friendly venues & receipt tracking',
    },
    {
      id: 'family_leisure',
      label: 'Family Leisure',
      desc: 'Kid-friendly pace, spacious stays, interactive attractions & stress-free transfers',
    },
  ];

  const vibeOptions = [
    'Culinary & Street Food',
    'Cultural Heritage',
    'Nature & Scenic Hikes',
    'Photography Hotspots',
    'Shopping & Boutiques',
    'Wellness & Thermal Spas',
    'Nightlife & Speakeasies',
    'Hidden Off-Grid Spots',
  ];

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isGenerating) return;

    // Simulate animated generation steps
    const interval = setInterval(() => {
      setGenerationStep((prev) => (prev + 1) % 4);
    }, 1200);

    try {
      await onGeneratePlan({
        destination: destination.trim(),
        durationDays,
        budgetTier,
        persona,
        travelers,
        vibeTags: selectedVibes,
        notes: notes.trim(),
      });
      clearInterval(interval);
      onClose();
    } catch (err) {
      clearInterval(interval);
      console.error(err);
    }
  };

  const stepsText = [
    'Analyzing airline routes and partner hotel availability...',
    'Curating personalized daily route matching your persona...',
    'Synthesizing real-time AccuWeather & advisory safety data...',
    'Generating 5 all-in-one digital wallet passes & QR codes...',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Create Your AI Holiday Itinerary
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Gemini AI and connected to our global partner network (Airlines, Hotels, Klook, Allianz & Weather).
          </p>
        </div>

        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-indigo-600 shadow-xl shadow-teal-500/20">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Synthesizing Your Custom Journey...</h3>
              <p className="text-xs text-teal-300 font-medium mt-1 animate-pulse">
                {stepsText[generationStep]}
              </p>
            </div>
            <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-400 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${((generationStep + 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Destination Input & Preset Chips */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Destination (City or Country)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tokyo, Paris, Bali, Swiss Alps, Singapore..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-sm"
                />
              </div>

              {/* Quick Pick Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {popularDestinations.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setDestination(d.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition cursor-pointer border ${
                      destination === d.name
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{d.flag} </span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration and Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Trip Duration ({durationDays} Days)
                </label>
                <div className="flex items-center gap-3 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <span className="font-bold text-white text-sm w-8 text-right">
                    {durationDays}d
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Travelers / Party
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-teal-400 text-xs cursor-pointer"
                  >
                    <option value="Solo Traveler">Solo Traveler</option>
                    <option value="Couple / 2 Travelers">Couple / 2 Travelers</option>
                    <option value="Family with Kids (3-4)">Family with Kids (3-4)</option>
                    <option value="Group of Friends (4+)">Group of Friends (4+)</option>
                    <option value="Corporate Offsite Team">Corporate Offsite Team</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Target Persona Segment (Canvas Page 6) */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Target Persona / Travel Style (From Canvas Page 6)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {personasList.map((p) => {
                  const isSel = persona === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setPersona(p.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? 'bg-indigo-950/70 border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${isSel ? 'text-teal-300' : 'text-white'}`}>
                          {p.label}
                        </span>
                        {isSel && <Check className="w-3.5 h-3.5 text-teal-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget Tier */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bargain', label: 'Bargain Hunter', sub: '$ Economical' },
                  { id: 'moderate', label: 'Balanced Standard', sub: '$$ Recommended' },
                  { id: 'luxury', label: 'PMET / Luxury', sub: '$$$ Premium Perks' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudgetTier(b.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      budgetTier === b.id
                        ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="text-xs">{b.label}</div>
                    <div className="text-[10px] text-slate-400">{b.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vibe and Interest Chips */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Trip Vibes & Experiences
              </label>
              <div className="flex flex-wrap gap-1.5">
                {vibeOptions.map((v) => {
                  const isSel = selectedVibes.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVibe(v)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border ${
                        isSel
                          ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white border-transparent'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Notes / Dietary */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Special Requests / Dietary / Timing (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Vegetarian dining preferences, early morning flights, need fast Wi-Fi..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-xs"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || !destination.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-400 to-indigo-600 hover:from-teal-300 hover:to-indigo-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-teal-500/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Generate Smart Itinerary</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
