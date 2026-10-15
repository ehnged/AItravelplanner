import React, { useState } from 'react';
import {
  Gift,
  Plane,
  Building,
  Ticket,
  ShieldCheck,
  Camera,
  CloudSun,
  Home,
  Copy,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Scissors,
  Coins,
  Percent,
} from 'lucide-react';
import { PartnerPerk } from '../types/travel.ts';

interface PartnerPerksViewProps {
  perks: PartnerPerk[];
  onClaimPerk: (id: string) => void;
  currency: string;
}

export const PartnerPerksView: React.FC<PartnerPerksViewProps> = ({
  perks,
  onClaimPerk,
  currency,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getPartnerIcon = (type: PartnerPerk['partnerType']) => {
    switch (type) {
      case 'airline':
        return Plane;
      case 'hotel':
        return Building;
      case 'airbnb':
        return Home;
      case 'tour':
      case 'attraction':
        return Ticket;
      case 'insurance':
        return ShieldCheck;
      case 'photographer':
        return Camera;
      case 'weather':
        return CloudSun;
      default:
        return Gift;
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const strategicAlliances = [
    {
      partner: 'Singapore Airlines & SkyAlliance',
      offer: 'Up to 12% flight rebate + Double KrisFlyer/Partner Miles',
      tag: 'Airlines (Canvas Page 1)',
      icon: Plane,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      partner: 'Marriott Bonvoy & Airbnb Luxe',
      offer: 'Complimentary high-floor upgrade & $50 host credit',
      tag: 'Hotels & Airbnb',
      icon: Building,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      partner: 'Klook & Local Attractions Alliance',
      offer: 'Instant 15% discount on FastPass tickets & e-vouchers',
      tag: 'Tourist Attractions',
      icon: Ticket,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      partner: 'Allianz Global Assistance',
      offer: 'Comprehensive flight delay auto-payout & 24/7 medical hotline',
      tag: 'Insurance Companies',
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      partner: 'Flytographer Global Photographers',
      offer: '$25 vacation photoshoot credit with local professional',
      tag: 'Professional Photographer',
      icon: Camera,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      partner: 'AccuWeather Global Radar',
      offer: 'Hyperlocal weather feed powering live itinerary rerouting',
      tag: 'Weather Networks',
      icon: CloudSun,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <div className="space-y-8 text-slate-800">
      {/* Top Banner (Trip.com Singapore Deals Format) */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-xs">
              <Gift className="w-6 h-6" />
            </span>
            <h2 className="text-2xl font-black tracking-tight">
              Trip.com Partner Deals & Promo Codes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Exclusive discounts from strategic partners outlined in our Business Model Canvas (Airlines, Hotels, Klook, Allianz, Photographers & Weather Networks).
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center shrink-0">
          <span className="text-xs text-blue-100 font-semibold">Total Savings Available</span>
          <p className="text-2xl font-black text-amber-300 mt-0.5">$270+ {currency}</p>
          <span className="text-[10px] text-blue-200">Trip Coins 3x multiplier applied</span>
        </div>
      </div>

      {/* Coupon Grid (Trip.com Voucher Ticket Card Style) */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <Percent className="w-5 h-5 text-blue-600" />
          <span>Active Promo Codes Ready to Redeem</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {perks.map((perk) => {
            const Icon = getPartnerIcon(perk.partnerType);

            return (
              <div
                key={perk.id}
                className="relative bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Coupon Header */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                      <Icon className="w-3.5 h-3.5" />
                      {perk.partnerName}
                    </span>
                    <span className="text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save {perk.savingsEstimate}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 mb-1">
                    {perk.headline}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {perk.description}
                  </p>
                </div>

                {/* Dashed voucher divider */}
                <div className="relative py-2 my-1 border-t-2 border-dashed border-slate-200">
                  <div className="absolute -left-7 -top-2 w-4 h-4 rounded-full bg-slate-50 border-r border-slate-200"></div>
                  <div className="absolute -right-7 -top-2 w-4 h-4 rounded-full bg-slate-50 border-l border-slate-200"></div>
                </div>

                {/* Coupon Footer with Code */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-semibold">Code:</span>
                    <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {perk.discountCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyCode(perk.discountCode)}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {copiedCode === perk.discountCode ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onClaimPerk(perk.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        perk.claimed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                      }`}
                    >
                      {perk.claimed ? 'Applied ✓' : 'Apply Code'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategic Partners Section (Canvas Page 1) */}
      <div className="pt-4">
        <h3 className="text-lg font-black text-slate-900 mb-2">
          Trip.com Strategic Alliance Network (Canvas Page 1)
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          How our strategic integrations provide competitive advantage and end-to-end travel peace of mind:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategicAlliances.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-xl border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.partner}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold block">{item.tag}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">
                    {item.offer}
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
