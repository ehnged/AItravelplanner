import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Ticket,
  CloudSun,
  ShieldCheck,
  Gift,
  CreditCard,
  PlusCircle,
  MessageSquare,
  Globe2,
  Building,
  Plane,
  Train,
  Car,
  Bot,
  HelpCircle,
  Smartphone,
  Coins,
  Crown,
  ChevronDown,
} from 'lucide-react';
import { TravelPersona } from '../types/travel.ts';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewTrip: () => void;
  onOpenChat: () => void;
  onOpenPricing: () => void;
  currentPersona: TravelPersona;
  onSelectPersona: (persona: TravelPersona) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  hasTrip: boolean;
  destinationName?: string;
  tripCoins?: number;
  onClaimDailyCoins?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTrip,
  onOpenChat,
  onOpenPricing,
  currentPersona,
  onSelectPersona,
  currency,
  setCurrency,
  hasTrip,
  destinationName,
  tripCoins = 1450,
  onClaimDailyCoins,
}) => {
  const [showAppQr, setShowAppQr] = useState(false);

  const mainCategories = [
    { id: 'itinerary', label: 'Itinerary & Route', icon: Compass, badge: 'AI' },
    { id: 'live-mode', label: 'Live Agile Journey', icon: CloudSun, badge: 'Dynamic' },
    { id: 'passes', label: 'Pass Wallet', icon: Ticket, count: '5' },
    { id: 'perks', label: 'Deals & Partner Perks', icon: Gift },
    { id: 'essentials', label: 'Destination & Safety', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs font-sans text-slate-800">
      {/* 1. Trip.com Singapore Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-1.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-blue-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Trip.com Singapore
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-500">
              Official Partner Network: Singapore Airlines, Marriott, Klook & Allianz
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* App Download Dropdown / Popover */}
            <div className="relative">
              <button
                onClick={() => setShowAppQr(!showAppQr)}
                className="hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">App</span>
              </button>
              {showAppQr && (
                <div className="absolute right-0 top-6 w-48 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl z-50 text-center">
                  <div className="w-28 h-28 mx-auto bg-slate-100 rounded-lg p-2 flex items-center justify-center border border-slate-200">
                    <div className="w-full h-full grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${i % 2 === 0 ? 'bg-blue-700' : 'bg-slate-300'} rounded-xs`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 mt-2">Scan to Get App</p>
                  <p className="text-[10px] text-slate-500">Trip.com Singapore Mobile</p>
                </div>
              )}
            </div>

            {/* Help & 24/7 Support */}
            <button
              onClick={onOpenChat}
              className="hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">24/7 Support</span>
            </button>

            {/* Currency Selector (SGD, USD, EUR, etc.) */}
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent font-semibold text-xs focus:outline-none cursor-pointer"
              >
                <option value="SGD">SGD (S$)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            {/* Trip Coins & Member Status */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={onClaimDailyCoins}
                className="flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full font-bold text-[11px] cursor-pointer transition"
                title="Claim daily bonus Trip Coins"
              >
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{tripCoins} Coins</span>
                <span className="text-[9px] text-amber-600 font-normal">
                  (≈ {(tripCoins / 100).toFixed(2)} {currency})
                </span>
              </button>

              <button
                onClick={onOpenPricing}
                className="hidden sm:flex items-center gap-1 text-blue-700 font-bold hover:underline cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Diamond VIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Header with Brand Logo & Product Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo (sg.trip.com format) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('itinerary')}>
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-black tracking-tight text-blue-600">
                    Trip<span className="text-slate-900">.com</span>
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-mono">
                    SG
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 -mt-1">
                  TripGenie AI Holiday Planner
                </span>
              </div>
            </div>
          </div>

          {/* Product Category Tabs (Trip.com signature style) */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainCategories.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* TripGenie AI Chatbot Floating Trigger */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>TripGenie AI</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            {/* Plan New Holiday Button */}
            <button
              onClick={onOpenNewTrip}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Plan</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
          {mainCategories.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
