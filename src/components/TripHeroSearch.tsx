import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  Plane,
  Building,
  Ticket,
  ChevronDown,
  Coins,
  RefreshCw,
  Compass,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { BudgetTier, TravelPersona } from '../types/travel.ts';

interface TripHeroSearchProps {
  onSearch: (params: {
    destination: string;
    durationDays: number;
    budgetTier: BudgetTier;
    persona: TravelPersona;
    travelers: string;
    vibeTags: string[];
    notes?: string;
  }) => Promise<void>;
  isSearching: boolean;
  currentDestination?: string;
  currency: string;
}

export const TripHeroSearch: React.FC<TripHeroSearchProps> = ({
  onSearch,
  isSearching,
  currentDestination = 'Tokyo, Japan',
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'package' | 'itinerary' | 'passes'>('package');
  const [destination, setDestination] = useState(currentDestination);
  const [durationDays, setDurationDays] = useState(4);
  const [persona, setPersona] = useState<TravelPersona>('busy_pmet');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('moderate');
  const [travelers, setTravelers] = useState('1 Traveler (Solo)');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([
    'Culinary & Street Food',
    'Cultural Heritage',
    'Photography Hotspots',
  ]);
  const [specialRequest, setSpecialRequest] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const popularDestinations = [
    { name: 'Tokyo, Japan', label: 'Tokyo', flag: '🇯🇵' },
    { name: 'Paris, France', label: 'Paris', flag: '🇫🇷' },
    { name: 'Bali, Indonesia', label: 'Bali', flag: '🇮🇩' },
    { name: 'Swiss Alps, Switzerland', label: 'Swiss Alps', flag: '🇨🇭' },
    { name: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { name: 'Bangkok, Thailand', label: 'Bangkok', flag: '🇹🇭' },
    { name: 'Seoul, South Korea', label: 'Seoul', flag: '🇰🇷' },
    { name: 'Rome, Italy', label: 'Rome', flag: '🇮🇹' },
  ];

  const personaLabels: Record<TravelPersona, { label: string; desc: string }> = {
    busy_pmet: { label: 'Busy PMET', desc: 'High efficiency, bleisure & work-friendly spots' },
    avid_traveller: { label: 'Avid Explorer', desc: 'Hidden gems & off-the-beaten-path culture' },
    bargain_hunter: { label: 'Bargain Hunter', desc: 'Best deals, free sights & budget eats' },
    beginner_planner: { label: 'First-Timer', desc: 'Easy transit, clear steps & low stress' },
    corporate_retreat: { label: 'Corporate Bleisure', desc: 'Group dining & retreat coordination' },
    family_leisure: { label: 'Family Leisure', desc: 'Kid-friendly pace & spacious stays' },
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || isSearching) return;
    await onSearch({
      destination: destination.trim(),
      durationDays,
      budgetTier,
      persona,
      travelers,
      vibeTags: selectedVibes,
      notes: specialRequest.trim(),
    });
  };

  return (
    <div className="relative mb-8">
      {/* Background Hero Banner in SmartTravel Royal Blue / Scenic Aesthetic */}
      <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 shadow-xl">
        {/* Subtle Scenic travel backdrop overlay */}
        <img
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2000&q=80"
          alt="Scenic Travel"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />

        {/* Hero Overlay Headline */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 text-white z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 self-start border border-white/30 text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>SmartTravel Singapore • TripGenie AI Travel Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
            Explore the World with AI Precision
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1 drop-shadow">
            All-in-one personalized holiday itineraries, integrated digital passes, partner airline & hotel perks, with real-time weather disruption rerouting.
          </p>
        </div>
      </div>

      {/* Floating White Booking Card (Classic SmartTravel Signature Box) */}
      <div className="relative max-w-6xl mx-auto -mt-20 sm:-mt-24 px-4 sm:px-6 z-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-5 sm:p-7 text-slate-800">
          {/* Top Tabs inside Booking Card */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('package')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'package'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Flights + Hotels + AI Itinerary</span>
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'itinerary'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Custom Route Planner</span>
            </button>
            <button
              onClick={() => setActiveTab('passes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'passes'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Attraction FastPass & Transit</span>
            </button>
          </div>

          {/* Main Booking Form */}
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
              {/* Destination Input */}
              <div className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl p-3 transition">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Destination</span>
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tokyo, Paris, Bali..."
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none placeholder-slate-400 truncate"
                />
                <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                  City, Airport or Landmark
                </span>
              </div>

              {/* Duration & Dates */}
              <div className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl p-3 transition">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Duration & Dates</span>
                </label>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {durationDays} Days / {durationDays - 1 > 0 ? durationDays - 1 : 1} Nights
                  </span>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="bg-white border border-slate-200 text-xs font-semibold rounded-lg px-2 py-0.5 text-blue-700 cursor-pointer focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                      <option key={d} value={d}>
                        {d} Days
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[11px] text-teal-600 font-semibold block mt-0.5">
                  AccuWeather sync enabled
                </span>
              </div>

              {/* Travelers & Persona */}
              <div className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400 rounded-2xl p-3 transition">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Travelers & Persona</span>
                </label>
                <div className="flex items-center gap-1">
                  <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value as TravelPersona)}
                    className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer truncate"
                  >
                    {Object.entries(personaLabels).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                  {travelers}
                </span>
              </div>

              {/* Budget Tier & Search Action */}
              <div className="flex flex-col justify-between gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">Tier:</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'bargain', label: '$ Bargain' },
                      { id: 'moderate', label: '$$ Standard' },
                      { id: 'luxury', label: '$$$ PMET' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudgetTier(b.id as any)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          budgetTier === b.id
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button (SmartTravel signature royal blue button) */}
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-3 px-4 rounded-2xl text-sm shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Planning with TripGenie...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-white" />
                      <span>Search & Generate Plan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Popular Destination Chips (SmartTravel style quick search inspiration) */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  Top Trending:
                </span>
                {popularDestinations.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setDestination(d.name)}
                    className={`px-2.5 py-1 rounded-full text-xs transition cursor-pointer font-medium ${
                      destination === d.name
                        ? 'bg-blue-100 text-blue-700 font-bold border border-blue-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{d.flag} </span>
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>

              {/* Advanced Filters Toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer text-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Preferences' : 'Dietary & Vibe Preferences'}</span>
              </button>
            </div>

            {/* Expandable Advanced Options */}
            {showAdvanced && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-2xl">
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">Trip Vibes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Culinary & Street Food',
                      'Cultural Heritage',
                      'Nature & Scenic Hikes',
                      'Photography Hotspots',
                      'Shopping & Boutiques',
                      'Wellness & Thermal Spas',
                    ].map((v) => {
                      const isSel = selectedVibes.includes(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setSelectedVibes((prev) =>
                              prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                            isSel
                              ? 'bg-blue-600 text-white font-bold border-transparent'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">
                    Special Requests / Dietary / Timing:
                  </span>
                  <input
                    type="text"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Halal or vegetarian food, quiet hotels, early morning flights..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </form>

          {/* SmartTravel Trust Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SmartTravel Guarantee • Verified Partners (Singapore Airlines, Klook, Allianz)</span>
            </div>
            <div className="flex items-center gap-3">
              <span>✓ Instant E-Pass Issuance</span>
              <span>✓ Free Date Flexibility</span>
              <span className="text-amber-600 font-bold">🪙 Earn 3x Trip Coins</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
