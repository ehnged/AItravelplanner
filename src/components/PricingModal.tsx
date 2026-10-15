import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  Shield,
  X,
  CreditCard,
  TrendingUp,
  Crown,
  Coins,
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string;
  onSelectTier: (tier: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  const tiers = [
    {
      id: 'free',
      name: 'Silver Explorer',
      badge: 'Bargain & Backpacker',
      price: '$0',
      period: 'forever',
      description: 'Standard access for casual holiday planners and bargain hunters.',
      features: [
        '1 Active AI Holiday Itinerary',
        'Standard Destination Must-Knows',
        'Digital Pass & E-Ticket Storage',
        'Earn 1x Trip Coins on Bookings',
        'Trip.com Community Help',
      ],
      popular: false,
      cta: 'Current Tier',
    },
    {
      id: 'pro',
      name: 'Platinum Adventurer',
      badge: 'Avid Travellers & PMET',
      price: billingCycle === 'annual' ? '$10' : '$14',
      period: 'per month',
      description: 'Agile journey re-planning with live AccuWeather rerouting & 3x Trip Coins.',
      features: [
        'Unlimited AI Dynamic Itineraries',
        'Real-Time Weather Disruption Rerouting',
        'Full Apple & Google Wallet E-Ticket Sync',
        'Exclusive 15-20% Airline & Hotel Partner Rebates',
        'Earn 3x Trip Coins on Every Booking',
        'Allianz Delay Protection Guarantee',
      ],
      popular: true,
      cta: 'Upgrade to Platinum',
    },
    {
      id: 'corporate',
      name: 'Diamond VIP Concierge',
      badge: 'Executives & Corporate Bleisure',
      price: billingCycle === 'annual' ? '$39' : '$49',
      period: 'per month',
      description: 'VIP white-glove 24/7 TripGenie AI assistant, lounge passes, and group offsite coordination.',
      features: [
        'Everything in Platinum Adventurer',
        '24/7 Dedicated TripGenie AI Priority Concierge',
        'Corporate Expense & Receipt Auto-Categorization',
        'Multi-Traveler Team Retreat Coordination',
        'Airport VIP Lounge Passes Included',
        'Earn 5x Trip Coins + Priority Hotel Upgrades',
      ],
      popular: false,
      cta: 'Select Diamond VIP',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto font-sans text-slate-800">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            SmartTravel.com Rewards & VIP Member Tiers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Elevate Your Travel with VIP Privileges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Tailored subscription model for bargain travelers, busy PMET executives, and corporate offsite groups.
          </p>

          {/* Billing Switch */}
          <div className="mt-5 inline-flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isSelected = currentTier === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-b from-blue-50/80 to-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                    : 'bg-white border border-slate-200 shadow-xs'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-300 fill-amber-300" />
                    <span>Most Popular for PMET</span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      {tier.badge}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">{tier.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{tier.description}</p>
                  </div>

                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">{tier.price}</span>
                    <span className="text-xs text-slate-500 font-semibold">/{tier.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                    {tier.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectTier(tier.id);
                    onClose();
                  }}
                  className={`w-full py-3 rounded-2xl text-xs font-black transition cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-slate-100 text-slate-800 border border-slate-300'
                      : tier.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isSelected ? 'Active Tier ✓' : tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Business Canvas Target Revenue Banner (Canvas Page 8) */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>
              <strong className="text-slate-900">Business Model Benchmark:</strong> Target Revenue $1.8M - $3M+ via B2C Subscriptions, Partner Commissions & Corporate Bleisure.
            </span>
          </div>
          <span className="text-blue-700 font-bold">SmartTravel.com SSL Secure Checkout</span>
        </div>
      </div>
    </div>
  );
};
