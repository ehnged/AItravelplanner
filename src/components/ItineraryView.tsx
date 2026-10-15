import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Camera,
  Utensils,
  Landmark,
  Compass,
  TreePine,
  ShoppingBag,
  Moon,
  Bus,
  CheckCircle2,
  Circle,
  ExternalLink,
  Tag,
  DollarSign,
  CloudSun,
  CloudRain,
  Sun,
  CloudLightning,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  Star,
  ShieldCheck,
  Coins,
  Ticket,
  Percent,
} from 'lucide-react';
import { TripPlan, DayItinerary, ActivityItem } from '../types/travel.ts';

interface ItineraryViewProps {
  trip: TripPlan;
  currency: string;
  onActivityToggleComplete: (dayIdx: number, actId: string) => void;
  onOpenPasses: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  currency,
  onActivityToggleComplete,
  onOpenPasses,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);

  const currentDay = trip.itinerary[selectedDayIndex] || trip.itinerary[0];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dining':
        return Utensils;
      case 'sightseeing':
        return Landmark;
      case 'culture':
        return Compass;
      case 'nature':
        return TreePine;
      case 'shopping':
        return ShoppingBag;
      case 'nightlife':
        return Moon;
      case 'transport':
        return Bus;
      default:
        return Compass;
    }
  };

  const getWeatherIcon = (condition?: string) => {
    switch (condition) {
      case 'rainy':
        return CloudRain;
      case 'cloudy':
        return CloudSun;
      case 'thunderstorm':
        return CloudLightning;
      default:
        return Sun;
    }
  };

  const filteredActivities = (currentDay?.activities || []).filter((act) => {
    if (filterCategory === 'all') return true;
    return act.category === filterCategory;
  });

  const totalCost = trip.itinerary.reduce((acc, day) => {
    return acc + day.activities.reduce((dAcc, act) => dAcc + (act.estimatedCost || 0), 0);
  }, 0);

  const completedActivitiesCount = trip.itinerary.reduce((acc, day) => {
    return acc + day.activities.filter((a) => a.isCompleted).length;
  }, 0);

  const totalActivitiesCount = trip.itinerary.reduce((acc, day) => {
    return acc + day.activities.length;
  }, 0);

  return (
    <div className="space-y-6 text-slate-800">
      {/* 1. Trip.com Days Carousel & Category Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Days selector tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {trip.itinerary.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              const WeatherIcon = getWeatherIcon(day.weatherForecast?.condition);

              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Day {day.dayNumber}</span>
                  {day.weatherForecast && (
                    <span
                      className={`flex items-center gap-1 text-[11px] pl-1.5 border-l ${
                        isSelected ? 'border-white/30 text-white' : 'border-slate-300 text-slate-500'
                      }`}
                    >
                      <WeatherIcon className="w-3 h-3" />
                      <span>{day.weatherForecast.tempC}°C</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'sightseeing', 'dining', 'culture', 'nature', 'relaxation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Day Theme Strip */}
        {currentDay && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider text-[11px]">
                Day {currentDay.dayNumber}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{currentDay.title}</h3>
              <span className="text-slate-400 hidden md:inline">— {currentDay.theme}</span>
            </div>

            {currentDay.weatherForecast && (
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-slate-800">{currentDay.weatherForecast.tempC}°C</span>
                <span className="text-slate-500">({currentDay.weatherForecast.description})</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Main Content Grid: Listings (Left) & Sticky Booking Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Trip.com Card-Based Listing (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredActivities.map((act) => {
            const CategoryIcon = getCategoryIcon(act.category);
            const isDone = act.isCompleted;
            const isTipExpanded = expandedTipId === act.id;

            return (
              <div
                key={act.id}
                className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Photo Thumbnail (Trip.com card style) */}
                  <div className="sm:w-56 h-48 sm:h-auto relative overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={
                        act.imageUrl ||
                        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={act.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Time pill overlay */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3 text-blue-400" />
                      <span>{act.time}</span>
                    </div>

                    {/* Category pill */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize flex items-center gap-1 shadow-xs">
                      <CategoryIcon className="w-3 h-3 text-blue-600" />
                      <span>{act.category}</span>
                    </div>
                  </div>

                  {/* Card Details Area */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      {/* Rating & Trip.com Preferred Tags */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 bg-blue-600 text-white text-[11px] font-black px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-white" />
                            <span>{act.rating || 4.9}</span>
                          </span>
                          <span className="text-xs font-bold text-slate-800">Excellent</span>
                          <span className="text-[11px] text-slate-400">
                            ({act.reviewCount || 1840} reviews)
                          </span>
                        </div>

                        {/* Complete Checkbox */}
                        <button
                          onClick={() => onActivityToggleComplete(selectedDayIndex, act.id)}
                          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          }`}
                        >
                          {isDone ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Visited ✓</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Mark Done</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-base font-extrabold text-slate-900 tracking-tight leading-snug mb-1 ${
                          isDone ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {act.title}
                      </h4>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                        {act.description}
                      </p>

                      {/* Location link */}
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate max-w-sm">{act.location}</span>
                        <span className="text-blue-600 hover:underline font-semibold cursor-pointer ml-1">
                          Map View
                        </span>
                      </div>

                      {/* Trip.com Benefit Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          Free Cancellation
                        </span>
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                          Instant Confirmation
                        </span>
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <Coins className="w-2.5 h-2.5" /> +50 Trip Coins
                        </span>
                      </div>

                      {/* Partner Perk Badge from Canvas */}
                      {act.partnerBadge && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-amber-900 mb-2">
                          <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <div className="truncate">
                            <strong className="font-extrabold text-slate-900">
                              {act.partnerBadge.partnerName}:{' '}
                            </strong>
                            <span>{act.partnerBadge.perk}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Pricing & TripGenie Tip Row */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* AI Insider Tip Button */}
                      {act.insiderTip ? (
                        <button
                          onClick={() => setExpandedTipId(isTipExpanded ? null : act.id)}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Insider Tip & Photography</span>
                          {isTipExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      ) : (
                        <div></div>
                      )}

                      {/* Trip.com Price Display Format */}
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 line-through mr-1.5">
                          ~${Math.round(act.estimatedCost * 1.25)} {currency}
                        </span>
                        <span className="text-base font-black text-blue-600">
                          ~${act.estimatedCost} {currency}
                        </span>
                        <span className="block text-[10px] text-slate-400">taxes included</span>
                      </div>
                    </div>

                    {/* Expandable Tip Drawer */}
                    {isTipExpanded && act.insiderTip && (
                      <div className="mt-3 p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                        <strong className="font-bold block text-blue-950 mb-0.5">
                          TripGenie Local Insight:
                        </strong>
                        {act.insiderTip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Trip.com Booking Summary & Partner Protection */}
        <div className="space-y-5 lg:sticky lg:top-24">
          {/* Trip Summary Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  Trip.com Package Summary
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {trip.destination}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                {trip.durationDays} Days / {trip.travelers}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs pb-4 border-b border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Activities & Sights:</span>
                <span className="font-bold text-slate-900">${totalCost} {currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Partner Hotel (Est.):</span>
                <span className="font-bold text-slate-900">
                  ${Math.round(trip.estimatedTotalCostUSD * 0.45)} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Flight / Transit (Est.):</span>
                <span className="font-bold text-slate-900">
                  ${Math.round(trip.estimatedTotalCostUSD * 0.35)} {currency}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Partner Vouchers Applied:</span>
                <span>-$75 {currency}</span>
              </div>
            </div>

            {/* Total and Rewards */}
            <div className="pt-4 mb-5">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs font-bold text-slate-500">Total Est. Package:</span>
                <span className="text-2xl font-black text-blue-600">
                  ${trip.estimatedTotalCostUSD} {currency}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl font-bold">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>Trip Coins to Earn:</span>
                </span>
                <span>+{trip.tripCoinsReward || 450} Coins</span>
              </div>
            </div>

            {/* Wallet Action Button */}
            <button
              onClick={onOpenPasses}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 px-4 rounded-2xl text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer mb-3"
            >
              <Ticket className="w-4 h-4" />
              <span>Access 5 Digital Passes & e-Tickets</span>
            </button>

            {/* Print Confirmation */}
            <button
              onClick={() => window.print()}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-2.5 px-4 rounded-2xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Booking Confirmation</span>
            </button>
          </div>

          {/* Allianz Guarantee Card (Canvas Page 1 & 3) */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 text-xs text-blue-900">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              <h4 className="font-extrabold text-blue-950 text-sm">
                Trip.com Guarantee & Allianz Shield
              </h4>
            </div>
            <p className="text-slate-600 leading-relaxed mb-3">
              Your itinerary includes full coverage for transit delays, flight cancellations, and 24/7 emergency medical assistance.
            </p>
            <div className="space-y-1.5 font-medium text-slate-700 text-[11px]">
              <div>✓ Automatic cash compensation if flight delayed &gt;3 hours</div>
              <div>✓ Free date alteration with partner hotels</div>
              <div>✓ Instant emergency hospital guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
