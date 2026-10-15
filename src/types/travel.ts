export type BudgetTier = 'bargain' | 'moderate' | 'luxury';

export type TravelPersona =
  | 'avid_traveller'
  | 'bargain_hunter'
  | 'busy_pmet'
  | 'beginner_planner'
  | 'corporate_retreat'
  | 'family_leisure';

export type ActivityCategory =
  | 'sightseeing'
  | 'dining'
  | 'culture'
  | 'adventure'
  | 'nature'
  | 'shopping'
  | 'relaxation'
  | 'nightlife'
  | 'transport';

export interface ActivityItem {
  id: string;
  time: string;
  title: string;
  description: string;
  category: ActivityCategory;
  estimatedCost: number;
  location: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  insiderTip?: string;
  partnerBadge?: {
    partnerName: string;
    perk: string;
    partnerType: 'airline' | 'hotel' | 'tour' | 'airbnb' | 'insurance' | 'attraction' | 'photographer' | 'weather';
  };
  weatherSuitability: 'indoor' | 'outdoor' | 'all-weather';
  isCompleted?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr?: string;
  title: string;
  theme: string;
  weatherForecast?: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snow' | 'thunderstorm';
    tempC: number;
    description: string;
  };
  activities: ActivityItem[];
}

export interface DigitalPass {
  id: string;
  type: 'flight' | 'hotel' | 'attraction' | 'transit' | 'insurance';
  title: string;
  provider: string;
  referenceCode: string;
  holderName: string;
  validDate: string;
  details: { [key: string]: string };
  status: 'active' | 'used' | 'upcoming';
  qrCodeValue: string;
  accentColor: string;
}

export interface DestinationMustKnows {
  customs: string[];
  etiquette: string[];
  powerPlug: {
    type: string;
    voltage: string;
  };
  currency: {
    code: string;
    name: string;
    cashVsCard: string;
    tippingStandard: string;
  };
  localTransitGuide: string;
  emergencyContacts: {
    police: string;
    ambulance: string;
    touristHotline: string;
  };
  languageTips: { phrase: string; translation: string; meaning: string }[];
}

export interface TravelAdvisory {
  safetyRating: 'Normal Precautions' | 'Exercise Increased Caution' | 'High Vigilance';
  overallStatus: string;
  entryRequirements: string;
  healthWeatherAdvisory: string;
  recentAlerts: string[];
}

export interface PreTripFollowUp {
  id: string;
  timing: string;
  title: string;
  description: string;
  category: 'booking' | 'advisory' | 'packing' | 'closure';
  status: 'pending' | 'completed';
}

export interface PartnerPerk {
  id: string;
  partnerName: string;
  partnerType: 'airline' | 'hotel' | 'tour' | 'airbnb' | 'insurance' | 'attraction' | 'photographer' | 'weather';
  headline: string;
  discountCode: string;
  savingsEstimate: string;
  description: string;
  expiry: string;
  claimed: boolean;
}

export interface TripPlan {
  id: string;
  destination: string;
  country: string;
  durationDays: number;
  budgetTier: BudgetTier;
  persona: TravelPersona;
  travelers: string;
  dates: {
    start: string;
    end: string;
  };
  tagline: string;
  overview: string;
  estimatedTotalCostUSD: number;
  currencyCode: string;
  tripCoinsReward?: number;
  itinerary: DayItinerary[];
  mustKnows: DestinationMustKnows;
  advisory: TravelAdvisory;
  passes: DigitalPass[];
  followUps: PreTripFollowUp[];
  partnerPerks: PartnerPerk[];
  weatherAlertActive?: string;
  lastAdjustedReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}
