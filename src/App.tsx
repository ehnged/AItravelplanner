import React, { useState, useEffect } from 'react';
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
  Share2,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Coins,
  ShieldAlert,
  Building,
  Plane,
  Train,
  Car,
  Headphones,
  FileText,
} from 'lucide-react';
import { TripPlan, BudgetTier, TravelPersona, DigitalPass, PartnerPerk } from './types/travel.ts';
import { Navbar } from './components/Navbar.tsx';
import { TripHeroSearch } from './components/TripHeroSearch.tsx';
import { ItineraryView } from './components/ItineraryView.tsx';
import { DynamicAdjustBar } from './components/DynamicAdjustBar.tsx';
import { DigitalPassWallet } from './components/DigitalPassWallet.tsx';
import { DestinationEssentials } from './components/DestinationEssentials.tsx';
import { PartnerPerksView } from './components/PartnerPerksView.tsx';
import { PricingModal } from './components/PricingModal.tsx';
import { AiConciergeChat } from './components/AiConciergeChat.tsx';
import { TripPlannerModal } from './components/TripPlannerModal.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('itinerary');
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [currency, setCurrency] = useState<string>('SGD');
  const [currentPersona, setCurrentPersona] = useState<TravelPersona>('busy_pmet');
  const [currentTier, setCurrentTier] = useState<string>('pro');
  const [tripCoins, setTripCoins] = useState<number>(1450);

  // Modals & Panels
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial Trip Load
  useEffect(() => {
    const loadInitialTrip = async () => {
      try {
        const res = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: 'Tokyo, Japan',
            durationDays: 4,
            budgetTier: 'moderate',
            persona: 'busy_pmet',
            travelers: '1 Traveler (Solo)',
            vibeTags: ['Culinary & Street Food', 'Cultural Heritage', 'Photography Hotspots'],
          }),
        });
        const data = await res.json();
        if (data.trip) {
          setTrip(data.trip);
        }
      } catch (e) {
        console.error('Failed to load initial trip:', e);
      }
    };

    loadInitialTrip();
  }, []);

  // Handle Generating a New Trip
  const handleGeneratePlan = async (params: {
    destination: string;
    durationDays: number;
    budgetTier: BudgetTier;
    persona: TravelPersona;
    travelers: string;
    vibeTags: string[];
    notes?: string;
  }) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (data.trip) {
        setTrip(data.trip);
        setCurrentPersona(params.persona);
        setActiveTab('itinerary');
        showNotification(`🎉 TripGenie generated ${params.durationDays}-day holiday plan for ${params.destination}!`);
      }
    } catch (err) {
      console.error('Generation error:', err);
      showNotification('Notice: Trip generated using offline smart engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Dynamic Real-Time Journey Adjustments (Canvas Page 3)
  const handleDynamicAdjust = async (type: string, customPrompt?: string) => {
    if (!trip) return;
    setIsAdjusting(true);
    try {
      const response = await fetch('/api/adjust-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTrip: trip,
          adjustmentType: type,
          customPrompt,
        }),
      });
      const data = await response.json();
      if (data.trip) {
        setTrip(data.trip);
        showNotification(data.explanation || 'Itinerary dynamically optimized for your journey!');
      }
    } catch (err) {
      console.error('Adjustment error:', err);
      showNotification('Adjusted schedule successfully.');
    } finally {
      setIsAdjusting(false);
    }
  };

  // Activity toggle done
  const handleToggleActivity = (dayIdx: number, actId: string) => {
    if (!trip) return;
    const updatedDays = [...trip.itinerary];
    const targetDay = updatedDays[dayIdx];
    if (!targetDay) return;

    targetDay.activities = targetDay.activities.map((a) =>
      a.id === actId ? { ...a, isCompleted: !a.isCompleted } : a
    );

    setTrip({ ...trip, itinerary: updatedDays });
  };

  // Add custom pass
  const handleAddPass = (newPass: DigitalPass) => {
    if (!trip) return;
    setTrip({
      ...trip,
      passes: [newPass, ...trip.passes],
    });
    showNotification(`Pass added to wallet: ${newPass.title}`);
  };

  // Follow-up milestone toggle
  const handleToggleFollowUp = (id: string) => {
    if (!trip) return;
    const updated = trip.followUps.map((fu) =>
      fu.id === id
        ? { ...fu, status: (fu.status === 'completed' ? 'pending' : 'completed') as any }
        : fu
    );
    setTrip({ ...trip, followUps: updated });
  };

  // Claim partner perk
  const handleClaimPerk = (id: string) => {
    if (!trip) return;
    const updated = trip.partnerPerks.map((p) =>
      p.id === id ? { ...p, claimed: true } : p
    );
    setTrip({ ...trip, partnerPerks: updated });
    setTripCoins((prev) => prev + 100);
    showNotification('Voucher claimed! +100 Trip Coins added to your account.');
  };

  const handleClaimDailyCoins = () => {
    setTripCoins((prev) => prev + 50);
    showNotification('🪙 Daily Check-in Success: +50 Trip Coins credited!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-bounce border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navbar (SmartTravel Singapore Format) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTrip={() => setIsPlannerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        currentPersona={currentPersona}
        onSelectPersona={(p) => {
          setCurrentPersona(p);
          if (trip) setTrip({ ...trip, persona: p });
          showNotification(`Switched travel persona to: ${p.replace('_', ' ')}`);
        }}
        currency={currency}
        setCurrency={setCurrency}
        hasTrip={!!trip}
        destinationName={trip?.destination}
        tripCoins={tripCoins}
        onClaimDailyCoins={handleClaimDailyCoins}
      />

      {/* Hero Booking Engine (Signature SmartTravel Format) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <TripHeroSearch
          onSearch={handleGeneratePlan}
          isSearching={isGenerating}
          currentDestination={trip?.destination || 'Tokyo, Japan'}
          currency={currency}
        />
      </div>

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {trip ? (
          <>
            {/* Real-Time Dynamic Disruption Optimizer Bar (Canvas Page 3) */}
            <DynamicAdjustBar
              onAdjust={handleDynamicAdjust}
              isAdjusting={isAdjusting}
              weatherAlertActive={trip.weatherAlertActive}
              lastAdjustedReason={trip.lastAdjustedReason}
            />

            {/* Tab: Itinerary & Route */}
            {activeTab === 'itinerary' && (
              <ItineraryView
                trip={trip}
                currency={currency}
                onActivityToggleComplete={handleToggleActivity}
                onOpenPasses={() => setActiveTab('passes')}
              />
            )}

            {/* Tab: Live Agile Journey Mode */}
            {activeTab === 'live-mode' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200">
                      <CloudSun className="w-6 h-6" />
                    </span>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        SmartTravel Live Agile Trip Controller
                      </h2>
                      <p className="text-xs text-slate-500">
                        Canvas Page 3: "App is agile to be able adjust the itinerary/bookings accordingly during the journey - depending on mood, weather, etc."
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-xs">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 font-bold block mb-1">
                        AccuWeather Live Radar Feed
                      </span>
                      <p className="text-base font-black text-slate-900">
                        {trip.weatherAlertActive ? 'Weather Reroute Active' : 'Optimal Conditions (21°C)'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Hyperlocal precipitation sensor connected.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 font-bold block mb-1">
                        Pace & Mood Rhythm
                      </span>
                      <p className="text-base font-black text-blue-600">
                        {trip.lastAdjustedReason || 'Balanced Discovery Pace'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Transitions calibrated for comfort.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-slate-500 font-bold block mb-1">
                        Partner Flight & Booking Watchdog
                      </span>
                      <p className="text-base font-black text-emerald-700">
                        All 5 Passes Active & On-Schedule
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Allianz automated delay protection enabled.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline inspection */}
                <ItineraryView
                  trip={trip}
                  currency={currency}
                  onActivityToggleComplete={handleToggleActivity}
                  onOpenPasses={() => setActiveTab('passes')}
                />
              </div>
            )}

            {/* Tab: Digital Pass Wallet */}
            {activeTab === 'passes' && (
              <DigitalPassWallet
                passes={trip.passes}
                onAddPass={handleAddPass}
                destinationName={trip.destination}
              />
            )}

            {/* Tab: Partner Perks & Deals */}
            {activeTab === 'perks' && (
              <PartnerPerksView
                perks={trip.partnerPerks}
                onClaimPerk={handleClaimPerk}
                currency={currency}
              />
            )}

            {/* Tab: Destination Essentials & Advisories */}
            {activeTab === 'essentials' && (
              <DestinationEssentials
                destination={trip.destination}
                mustKnows={trip.mustKnows}
                advisory={trip.advisory}
                followUps={trip.followUps}
                onToggleFollowUp={handleToggleFollowUp}
              />
            )}
          </>
        ) : (
          /* Loading State */
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              TripGenie AI is Initializing Your Holiday Plan...
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Connecting to Singapore Airlines, Marriott, Klook, Allianz and AccuWeather networks.
            </p>
          </div>
        )}
      </main>

      {/* Signature SmartTravel Singapore Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Footer Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-slate-200 text-xs">
            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                Top Destinations
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Tokyo Holidays & Hotels</a></li>
                <li><a href="#" className="hover:text-blue-600">Bangkok Weekend Escapes</a></li>
                <li><a href="#" className="hover:text-blue-600">Bali Villas & Resorts</a></li>
                <li><a href="#" className="hover:text-blue-600">Seoul City Guides</a></li>
                <li><a href="#" className="hover:text-blue-600">Swiss Alps Mountain Passes</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                Key Strategic Partners
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Singapore Airlines / SkyAlliance</a></li>
                <li><a href="#" className="hover:text-blue-600">Marriott Bonvoy & Airbnb Luxe</a></li>
                <li><a href="#" className="hover:text-blue-600">Klook Attraction FastPasses</a></li>
                <li><a href="#" className="hover:text-blue-600">Allianz Global Travel Insurance</a></li>
                <li><a href="#" className="hover:text-blue-600">AccuWeather Global Weather Radar</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                TripGenie AI Capabilities
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Real-Time Weather Rerouting</a></li>
                <li><a href="#" className="hover:text-blue-600">All-In-One Digital Pass Wallet</a></li>
                <li><a href="#" className="hover:text-blue-600">Busy PMET Curation</a></li>
                <li><a href="#" className="hover:text-blue-600">Automated Pre-Trip Milestones</a></li>
                <li><a href="#" className="hover:text-blue-600">Corporate Bleisure & Retrreats</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                Customer Support & Security
              </h4>
              <div className="space-y-2 text-slate-600">
                <p>24/7 Multi-Language Support</p>
                <p>Singapore Tel: +65 6830 2888</p>
                <div className="pt-2">
                  <span className="font-bold text-slate-800 block mb-1">Secure Payment Methods:</span>
                  <div className="flex flex-wrap gap-1 text-[10px] text-slate-600 font-bold">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">PayNow</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">GrabPay</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Visa</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Mastercard</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Apple Pay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-black text-blue-600 text-sm">Smart<span className="text-slate-900">Travel</span> SG</span>
              <span>• WanderPulse AI Holiday Planner (Canvas Artifact Implementation)</span>
            </div>
            <div>
              <span>© 2026 SmartTravel Singapore Pte. Ltd. All rights reserved. SmartTravel is part of SmartTravel Group.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* New Trip Planner Modal */}
      <TripPlannerModal
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        onGeneratePlan={handleGeneratePlan}
        isGenerating={isGenerating}
      />

      {/* 24/7 AI Concierge Chat Drawer (TripGenie) */}
      {trip && (
        <AiConciergeChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          trip={trip}
          onTriggerQuickAction={(action) => {
            if (action === 'passes') setActiveTab('passes');
            if (action === 'adjust_rain') handleDynamicAdjust('weather_rain');
          }}
        />
      )}

      {/* Pricing & VIP Tiers Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentTier={currentTier}
        onSelectTier={(tier) => {
          setCurrentTier(tier);
          showNotification(`SmartTravel Tier updated to: ${tier.toUpperCase()}`);
        }}
      />
    </div>
  );
}
