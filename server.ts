import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { TripPlan, DayItinerary, DigitalPass } from './src/types/travel.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Fallback high quality trip generator if AI key is missing or quota exceeded
function generateFallbackTrip(
  destination: string,
  daysCount: number,
  budgetTier: string,
  persona: string,
  travelers: string
): TripPlan {
  const destClean = destination.trim() || 'Tokyo, Japan';
  const isJapan = /tokyo|japan|kyoto|osaka/i.test(destClean);
  const isParis = /paris|france/i.test(destClean);
  const isBali = /bali|indonesia/i.test(destClean);

  const city = isJapan ? 'Tokyo' : isParis ? 'Paris' : isBali ? 'Bali' : destClean;
  const country = isJapan ? 'Japan' : isParis ? 'France' : isBali ? 'Indonesia' : 'Global';

  const days: DayItinerary[] = [];
  const count = Math.max(1, Math.min(daysCount || 3, 10));

  const sampleThemes = [
    {
      title: `Arrival & Iconic Landmarks`,
      theme: 'Orientation & Signature Views',
      activities: [
        {
          id: 'act-1',
          time: '09:30 AM',
          title: `Arrival & Check-in at Curated Accommodation`,
          description: `Check into partner hotel with pre-arranged early digital room key pass. Drop bags and refresh.`,
          category: 'transport' as const,
          estimatedCost: 35,
          location: `${city} Central Station / Hub`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
            : isParis
            ? 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          reviewCount: 2840,
          tags: ['Instant Check-in', 'Free Cancellation', 'Trip.com Preferred'],
          insiderTip: 'Show your WanderPulse mobile booking voucher for complimentary high-floor upgrade.',
          partnerBadge: {
            partnerName: 'Marriott Bonvoy / Airbnb Luxe',
            perk: 'Complimentary Late Checkout & Welcome Drink',
            partnerType: 'hotel' as const,
          },
          weatherSuitability: 'all-weather' as const,
        },
        {
          id: 'act-2',
          time: '11:45 AM',
          title: `Gastronomic Discovery & Signature Local Lunch`,
          description: `Savor acclaimed regional delicacies at an artisan dining spot tailored to your ${persona} preferences.`,
          category: 'dining' as const,
          estimatedCost: 28,
          location: `Old Quarter, ${city}`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          reviewCount: 1950,
          tags: ['Michelin Recommended', 'Trip Coins 3x', 'Authentic Local'],
          insiderTip: 'Try the chef specialty course; booking reserved under VIP guest list.',
          weatherSuitability: 'indoor' as const,
        },
        {
          id: 'act-3',
          time: '02:30 PM',
          title: `Iconic Historic & Cultural Exploration`,
          description: `Immersive exploration of premier heritage landmarks with audio commentary and fast-track access.`,
          category: 'sightseeing' as const,
          estimatedCost: 22,
          location: `Heritage District, ${city}`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          reviewCount: 4210,
          tags: ['Top Rated Landmark', 'Skip-The-Line Pass', 'Photo Hotspot'],
          insiderTip: 'Best panorama for photography is from the upper terrace at golden hour.',
          partnerBadge: {
            partnerName: 'Klook FastTrack Pass',
            perk: '15% Off Skip-The-Line e-Pass',
            partnerType: 'tour' as const,
          },
          weatherSuitability: 'outdoor' as const,
        },
        {
          id: 'act-4',
          time: '07:00 PM',
          title: `Atmospheric Evening Walk & Rooftop Social`,
          description: `Relax with craft beverages and panoramic city lights overlooking ${city} skyline.`,
          category: 'relaxation' as const,
          estimatedCost: 45,
          location: `Skyline Promenade, ${city}`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
          rating: 4.7,
          reviewCount: 1620,
          tags: ['Panoramic View', 'Sunset Bar', 'Evening Chill'],
          insiderTip: 'Sunset occurs around 6:50 PM; outdoor heating available if chilly.',
          weatherSuitability: 'all-weather' as const,
        },
      ],
    },
    {
      title: `Deep Cultural Immersion & Hidden Gems`,
      theme: 'Off-the-Beaten-Path & Local Artisans',
      activities: [
        {
          id: 'act-5',
          time: '09:00 AM',
          title: `Morning Artisan Market & Specialty Coffee Roasters`,
          description: `Stroll through vibrant morning stalls, meet local makers, and sample fresh morning treats.`,
          category: 'shopping' as const,
          estimatedCost: 18,
          location: `Artisans Guild Quarter`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          reviewCount: 1420,
          tags: ['Local Artisans', 'Specialty Coffee', 'Morning Vibe'],
          insiderTip: 'Most vendors accept digital contactless payment; carry small cash for tiny stalls.',
          weatherSuitability: 'all-weather' as const,
        },
        {
          id: 'act-6',
          time: '12:30 PM',
          title: `Authentic Chef Table Tasting Lunch`,
          description: `Farm-to-table lunch pairing seasonal ingredients with local culinary storytelling.`,
          category: 'dining' as const,
          estimatedCost: 40,
          location: `Riverside Bistro, ${city}`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          reviewCount: 2310,
          tags: ['Farm-to-Table', 'Chef Selection', 'Wine Pairing'],
          insiderTip: 'Vegetarian tasting menu is widely praised by local food critics.',
          weatherSuitability: 'indoor' as const,
        },
        {
          id: 'act-7',
          time: '03:00 PM',
          title: `Exclusive Local Workshop / Museum Experience`,
          description: `Hands-on creative session or curated private gallery tour bypassing long public queues.`,
          category: 'culture' as const,
          estimatedCost: 35,
          location: `Cultural Preservation Pavilion`,
          imageUrl: isJapan
            ? 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          reviewCount: 3890,
          tags: ['Priority Entry', 'Curated Guide', 'Trip.com Exclusive'],
          partnerBadge: {
            partnerName: 'Local Bureau of Tourism',
            perk: 'Official Tourist Pass Partner Discount',
            partnerType: 'attraction' as const,
          },
          weatherSuitability: 'indoor' as const,
        },
        {
          id: 'act-8',
          time: '08:00 PM',
          title: `Lantern-lit Alleyways & Night Bites`,
          description: `Explore charming side streets lined with atmospheric micro-eateries and live acoustic music.`,
          category: 'nightlife' as const,
          estimatedCost: 30,
          location: `Historic Evening District`,
          weatherSuitability: 'outdoor' as const,
        },
      ],
    },
    {
      title: `Scenic Nature & Memorable Finale`,
      theme: 'Vistas, Photography & Sunset Farewell',
      activities: [
        {
          id: 'act-9',
          time: '08:30 AM',
          title: `Scenic Botanical Gardens or Nature Trail`,
          description: `Crisp morning walk through lush landscapes, historic bridges, and peaceful water gardens.`,
          category: 'nature' as const,
          estimatedCost: 15,
          location: `National Heritage Parklands`,
          insiderTip: 'Booked photographer session available between 9:00 and 10:00 AM for postcard photos.',
          partnerBadge: {
            partnerName: 'Flytographer Partner',
            perk: '1-Hour Vacation Photo Shoot $25 Voucher',
            partnerType: 'photographer' as const,
          },
          weatherSuitability: 'outdoor' as const,
        },
        {
          id: 'act-10',
          time: '01:00 PM',
          title: `Farewell Feast with Scenic Vista`,
          description: `A celebrated dining experience with panoramic views of ${city} to reflect on the trip journey.`,
          category: 'dining' as const,
          estimatedCost: 55,
          location: `Grand Terrace Dining, ${city}`,
          insiderTip: 'Show your boarding pass for priority dessert service.',
          weatherSuitability: 'indoor' as const,
        },
        {
          id: 'act-11',
          time: '04:30 PM',
          title: `Last-minute Souvenirs & Airport Express Transit`,
          description: `Pick up curated local confections and travel essentials before seamless high-speed transit.`,
          category: 'transport' as const,
          estimatedCost: 20,
          location: `Central Transit Hub`,
          partnerBadge: {
            partnerName: 'National Rail Transit Partner',
            perk: 'Direct Airport Express Fast-QR Scan',
            partnerType: 'tour' as const,
          },
          weatherSuitability: 'indoor' as const,
        },
      ],
    },
  ];

  for (let i = 0; i < count; i++) {
    const template = sampleThemes[i % sampleThemes.length];
    days.push({
      dayNumber: i + 1,
      title: `Day ${i + 1}: ${template.title}`,
      theme: template.theme,
      weatherForecast: {
        condition: i === 1 ? 'cloudy' : 'sunny',
        tempC: isJapan ? 21 : isParis ? 19 : isBali ? 29 : 22,
        description: i === 1 ? 'Partly cloudy, mild breeze' : 'Bright and sunny, ideal for exploration',
      },
      activities: template.activities.map((act, idx) => ({
        ...act,
        id: `day-${i + 1}-act-${idx + 1}`,
      })),
    });
  }

  const passes: DigitalPass[] = [
    {
      id: 'pass-air-1',
      type: 'flight',
      title: `Flight to ${city} (International)`,
      provider: 'Singapore Airlines / SkyAlliance',
      referenceCode: 'WP-FL-9281X',
      holderName: 'Valued Traveler (WanderPulse Member)',
      validDate: 'Day 1 - 07:45 Departure',
      details: {
        Flight: 'SQ 638',
        Terminal: 'T3, Gate B12',
        Seat: '14A (Window)',
        Class: 'Economy Comfort Plus',
        Baggage: '2x 23kg Included',
      },
      status: 'active',
      qrCodeValue: 'WP-FLIGHT-SQ638-PASSENGER-OK',
      accentColor: 'indigo',
    },
    {
      id: 'pass-hotel-2',
      type: 'hotel',
      title: `${city} Heritage Grand Stay`,
      provider: 'Partner Hospitality Group',
      referenceCode: 'WP-HTL-7742',
      holderName: 'Valued Traveler',
      validDate: `Days 1 - ${count}`,
      details: {
        Confirmation: 'HM-8849201',
        Room: 'Deluxe City View King',
        CheckIn: '14:00 (Early Pass)',
        SmartLockPIN: '• 4 8 2 9 #',
        Perks: 'Daily Breakfast & Spa Credit',
      },
      status: 'active',
      qrCodeValue: 'WP-HOTEL-PIN-4829-CHECKIN',
      accentColor: 'amber',
    },
    {
      id: 'pass-attr-3',
      type: 'attraction',
      title: `${city} City Wonders VIP e-Pass`,
      provider: 'Klook & Local Attractions Alliance',
      referenceCode: 'WP-ATT-3310',
      holderName: 'Valued Traveler',
      validDate: `Days 1 - ${count}`,
      details: {
        Inclusions: 'Top 5 Heritage Monuments & Observation Decks',
        FastTrack: 'Skip the standard line enabled',
        Validity: 'Unlimited 72-Hour scan',
      },
      status: 'active',
      qrCodeValue: 'WP-ATTRACTION-FASTPASS-VALID',
      accentColor: 'emerald',
    },
    {
      id: 'pass-transit-4',
      type: 'transit',
      title: `All-Line Metro & Rail Digital Pass`,
      provider: `${city} Transit Authority & Ministry of Transport`,
      referenceCode: 'WP-TRN-9092',
      holderName: 'Valued Traveler',
      validDate: `Entire Stay`,
      details: {
        Network: 'All Subways, Busses & Airport Express',
        Type: 'Contactless Tap-and-Ride',
        BalanceStatus: 'Unlimited Active Pass',
      },
      status: 'active',
      qrCodeValue: 'WP-TRANSIT-NFC-TAP-ACTIVE',
      accentColor: 'blue',
    },
    {
      id: 'pass-ins-5',
      type: 'insurance',
      title: `Comprehensive Global Shield Policy`,
      provider: 'Allianz Global Assistance Partner',
      referenceCode: 'WP-INS-6621-MED',
      holderName: 'Valued Traveler',
      validDate: 'Full Trip Duration',
      details: {
        PolicyNo: 'ALZ-993-41829',
        MedicalCoverage: '$500,000 USD Worldwide',
        FlightDelay: 'Auto-claim payout past 3 hrs',
        Emergency24h: '+1-800-555-HELP',
      },
      status: 'active',
      qrCodeValue: 'WP-INSURANCE-POLICY-VERIFIED',
      accentColor: 'rose',
    },
  ];

  return {
    id: `trip-${Date.now()}`,
    destination: city,
    country,
    durationDays: count,
    budgetTier: (budgetTier as any) || 'moderate',
    persona: (persona as any) || 'busy_pmet',
    travelers: travelers || '1 Traveler (Solo)',
    dates: {
      start: 'Tomorrow',
      end: `${count} days later`,
    },
    tagline: `Curated AI Journey to ${city}: Precision, Culture & Seamless Perks`,
    overview: `Specially crafted for ${persona.replace('_', ' ')} seeking a seamless holiday in ${city}. Features partner discounts, digital passes, and agile adaptability for local weather conditions.`,
    estimatedTotalCostUSD: budgetTier === 'bargain' ? 380 * count : budgetTier === 'luxury' ? 950 * count : 580 * count,
    currencyCode: isJapan ? 'JPY' : isParis ? 'EUR' : isBali ? 'IDR' : 'USD',
    tripCoinsReward: 450,
    itinerary: days,
    mustKnows: {
      customs: [
        isJapan
          ? 'Always remove shoes when entering traditional tatami areas and ryokans.'
          : 'Greet shopkeepers with a friendly greeting upon entering establishments.',
        'Carry a reusable bag for small boutique purchases.',
        'Keep voice level low on public transit and high-speed trains.',
      ],
      etiquette: [
        isJapan
          ? 'No tipping is accepted; exceptional hospitality is already included.'
          : 'Service charge is usually included, but small rounding is appreciated.',
        'Escalator etiquette: Stand on the designated side and walk on the other.',
        'Always ask permission before taking close-up portraits of street vendors or monks.',
      ],
      powerPlug: {
        type: isJapan ? 'Type A & B (2-pin flat)' : isParis ? 'Type C & E (round pins)' : 'Type C & G',
        voltage: isJapan ? '100V / 50-60Hz' : '230V / 50Hz',
      },
      currency: {
        code: isJapan ? 'JPY (¥)' : isParis ? 'EUR (€)' : isBali ? 'IDR (Rp)' : 'USD ($)',
        name: isJapan ? 'Japanese Yen' : isParis ? 'Euro' : isBali ? 'Indonesian Rupiah' : 'US Dollar',
        cashVsCard: 'Digital credit/IC cards widely accepted; keep minor cash for temple charms and small street food stalls.',
        tippingStandard: isJapan ? 'Zero tipping required (considered rude)' : '5-10% for exceptional dining service',
      },
      localTransitGuide: `Tap your WanderPulse digital transit pass at fare gates. Subways are punctual to within 30 seconds.`,
      emergencyContacts: {
        police: isJapan ? '110' : '112',
        ambulance: isJapan ? '119' : '112',
        touristHotline: '+81-3-3201-3331 (24/7 Multi-language support)',
      },
      languageTips: [
        { phrase: 'Arigatou gozaimasu', translation: 'Thank you very much', meaning: 'Universal polite gratitude' },
        { phrase: 'Sumimasen', translation: 'Excuse me / Pardon', meaning: 'Getting attention or saying sorry' },
        { phrase: 'Kore o kudasai', translation: 'Please give me this', meaning: 'Pointing at menus or items' },
      ],
    },
    advisory: {
      safetyRating: 'Normal Precautions',
      overallStatus: 'Safe & Highly Hospitable. Tourist infrastructure is fully operational with pristine transit.',
      entryRequirements: 'Passport must be valid for at least 6 months. Visa exemption applies for up to 90 days for most nationalities.',
      healthWeatherAdvisory: 'Air quality is excellent. Pack light layers and comfortable walking footwear for cobbles.',
      recentAlerts: [
        'Spring blossom/autumn peak: Expect higher foot traffic at key shrine viewpoints between 11 AM - 3 PM.',
        'Weather radar: AccuWeather partner indicates clear blue skies with moderate afternoon breeze.',
      ],
    },
    passes,
    followUps: [
      {
        id: 'fu-1',
        timing: '7 Days Before Trip',
        title: 'Passport & Visa Expiry Verification',
        description: 'Verify 6-month validity on passport and ensure electronic travel authorization is submitted.',
        category: 'advisory',
        status: 'completed',
      },
      {
        id: 'fu-2',
        timing: '48 Hours Before Departure',
        title: 'Partner Airline Digital Check-In',
        description: 'Check in via Singapore Airlines / Airline Partner pass in your wallet to claim priority baggage drop.',
        category: 'booking',
        status: 'pending',
      },
      {
        id: 'fu-3',
        timing: '24 Hours Before Departure',
        title: 'Weather Sync & Pack List Reminder',
        description: 'Forecast reports 21°C pleasant weather. Pack comfortable footwear and a light windbreaker.',
        category: 'packing',
        status: 'pending',
      },
      {
        id: 'fu-4',
        timing: 'Day 2 Reminder',
        title: 'Attraction Timed-Entry Confirmation',
        description: 'Museum timed ticket QR activated for 3:00 PM entry. Skip the outdoor ticket booth line.',
        category: 'closure',
        status: 'pending',
      },
    ],
    partnerPerks: [
      {
        id: 'perk-1',
        partnerName: 'Singapore Airlines / SkyAlliance',
        partnerType: 'airline',
        headline: 'Exclusive 12% Flight Rebate & Double Miles',
        discountCode: 'WANDER-SQ12',
        savingsEstimate: '$140 USD',
        description: 'Valid for roundtrip flights booked through WanderPulse partner link.',
        expiry: 'Valid for this booking',
        claimed: false,
      },
      {
        id: 'perk-2',
        partnerName: 'Airbnb & Boutique Hotels',
        partnerType: 'airbnb',
        headline: 'Free Welcome Amenity & $50 Experience Credit',
        discountCode: 'WP-BNB50',
        savingsEstimate: '$50 USD',
        description: 'Applied automatically to curated properties and local host experiences.',
        expiry: 'Valid for this trip',
        claimed: true,
      },
      {
        id: 'perk-3',
        partnerName: 'Allianz Global Insurance',
        partnerType: 'insurance',
        headline: '20% Off Comprehensive Medical & Luggage Shield',
        discountCode: 'ALLIANZ-WP20',
        savingsEstimate: '$35 USD',
        description: 'Includes automated flight delay cash compensation if delayed >3 hours.',
        expiry: 'Pre-trip activation',
        claimed: true,
      },
      {
        id: 'perk-4',
        partnerName: 'Klook & Local Tour Agency',
        partnerType: 'tour',
        headline: '15% Off All Attraction FastPass Tickets',
        discountCode: 'KLOOK-WP15',
        savingsEstimate: '$45 USD',
        description: 'Redeem instant digital barcode vouchers for museums, theme parks, and cruises.',
        expiry: 'Valid 30 days',
        claimed: false,
      },
    ],
  };
}

// 1. Generate Plan endpoint
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const { destination, durationDays, budgetTier, persona, travelers, vibeTags, notes } = req.body;
    const dest = destination || 'Tokyo, Japan';
    const days = Math.max(1, Math.min(Number(durationDays) || 3, 10));

    if (!ai) {
      console.log('No GEMINI_API_KEY set, serving intelligent structured template.');
      const fallback = generateFallbackTrip(dest, days, budgetTier, persona, travelers);
      return res.json({ trip: fallback, source: 'template' });
    }

    const prompt = `
You are WanderPulse AI, an intelligent holiday planner backed by an extensive partner network (Airlines, Hotels, Airbnb, Tour Agencies, Insurance, Tourist Attractions, Professional Photographers, and Weather Networks).
Create a complete, realistic, richly detailed travel plan in valid JSON format.

Trip Parameters:
- Destination: ${dest}
- Duration: ${days} days
- Budget Tier: ${budgetTier || 'moderate'} (bargain, moderate, or luxury)
- Persona Segment: ${persona || 'busy_pmet'} (options: avid_traveller, bargain_hunter, busy_pmet, beginner_planner, corporate_retreat, family_leisure)
- Travelers: ${travelers || 'Solo'}
- Vibe Tags: ${(vibeTags || []).join(', ')}
- Special Notes: ${notes || 'None'}

Return ONLY a valid JSON object with the following structure:
{
  "tagline": "string (catchy, inspiring)",
  "overview": "string (2-3 sentences explaining how this plan fits their persona, budget, and travel goals)",
  "estimatedTotalCostUSD": number,
  "currencyCode": "string (e.g. USD, EUR, JPY)",
  "country": "string",
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Day 1: Title",
      "theme": "Theme description",
      "weatherForecast": {
        "condition": "sunny" | "cloudy" | "rainy",
        "tempC": 22,
        "description": "Short weather summary"
      },
      "activities": [
        {
          "id": "act-1",
          "time": "09:00 AM",
          "title": "Activity name",
          "description": "Engaging description",
          "category": "sightseeing" | "dining" | "culture" | "adventure" | "nature" | "shopping" | "relaxation" | "nightlife" | "transport",
          "estimatedCost": 25,
          "location": "Specific place or landmark",
          "insiderTip": "Specific insider tip for travellers",
          "partnerBadge": {
            "partnerName": "Partner Name (e.g., Klook, Singapore Airlines, Airbnb, Marriott, Allianz, Flytographer)",
            "perk": "e.g. 15% FastPass discount or Free welcome drink",
            "partnerType": "airline" | "hotel" | "tour" | "airbnb" | "insurance" | "attraction" | "photographer" | "weather"
          },
          "weatherSuitability": "indoor" | "outdoor" | "all-weather"
        }
      ]
    }
  ],
  "mustKnows": {
    "customs": ["string", "string"],
    "etiquette": ["string", "string"],
    "powerPlug": { "type": "string", "voltage": "string" },
    "currency": {
      "code": "string",
      "name": "string",
      "cashVsCard": "string",
      "tippingStandard": "string"
    },
    "localTransitGuide": "string",
    "emergencyContacts": {
      "police": "string",
      "ambulance": "string",
      "touristHotline": "string"
    },
    "languageTips": [
      { "phrase": "string", "translation": "string", "meaning": "string" }
    ]
  },
  "advisory": {
    "safetyRating": "Normal Precautions" | "Exercise Increased Caution" | "High Vigilance",
    "overallStatus": "string",
    "entryRequirements": "string",
    "healthWeatherAdvisory": "string",
    "recentAlerts": ["string", "string"]
  },
  "passes": [
    {
      "id": "pass-1",
      "type": "flight" | "hotel" | "attraction" | "transit" | "insurance",
      "title": "Pass title",
      "provider": "Provider / Airline / Hotel name",
      "referenceCode": "Code e.g. WP-1234",
      "holderName": "Valued Traveler",
      "validDate": "Valid period",
      "details": { "Key": "Value" },
      "status": "active",
      "qrCodeValue": "string",
      "accentColor": "indigo" | "amber" | "emerald" | "blue" | "rose"
    }
  ],
  "followUps": [
    {
      "id": "fu-1",
      "timing": "e.g. 7 Days Prior",
      "title": "Title",
      "description": "What traveller should do",
      "category": "booking" | "advisory" | "packing" | "closure",
      "status": "pending"
    }
  ],
  "partnerPerks": [
    {
      "id": "perk-1",
      "partnerName": "Partner name",
      "partnerType": "airline" | "hotel" | "tour" | "airbnb" | "insurance" | "attraction" | "photographer" | "weather",
      "headline": "Discount title",
      "discountCode": "WP-PROMO",
      "savingsEstimate": "$XX USD",
      "description": "Benefit details",
      "expiry": "Valid for trip",
      "claimed": false
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    const completeTrip: TripPlan = {
      id: `trip-${Date.now()}`,
      destination: dest,
      country: parsed.country || 'Global Destination',
      durationDays: days,
      budgetTier: budgetTier || 'moderate',
      persona: persona || 'busy_pmet',
      travelers: travelers || '1 Traveler',
      dates: {
        start: 'Upcoming Journey',
        end: `${days} days later`,
      },
      tagline: parsed.tagline || `Your Tailored AI Journey to ${dest}`,
      overview: parsed.overview || `Custom travel plan designed for ${persona} in ${dest}.`,
      estimatedTotalCostUSD: parsed.estimatedTotalCostUSD || 1200,
      currencyCode: parsed.currencyCode || 'USD',
      itinerary: parsed.itinerary || [],
      mustKnows: parsed.mustKnows,
      advisory: parsed.advisory,
      passes: parsed.passes || [],
      followUps: parsed.followUps || [],
      partnerPerks: parsed.partnerPerks || [],
    };

    return res.json({ trip: completeTrip, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating plan with Gemini, using fallback:', error);
    const fallback = generateFallbackTrip(
      req.body.destination || 'Tokyo, Japan',
      Number(req.body.durationDays) || 3,
      req.body.budgetTier || 'moderate',
      req.body.persona || 'busy_pmet',
      req.body.travelers || 'Solo'
    );
    return res.json({ trip: fallback, source: 'fallback', error: error?.message });
  }
});

// 2. Agile Dynamic Trip Adjustment endpoint (Canvas Page 3: "App is agile to adjust itinerary/bookings accordingly during the journey - depending on mood, weather, etc.")
app.post('/api/adjust-itinerary', async (req: Request, res: Response) => {
  try {
    const { currentTrip, adjustmentType, customPrompt } = req.body;
    if (!currentTrip) {
      return res.status(400).json({ error: 'currentTrip is required' });
    }

    let adjustmentInstruction = '';
    switch (adjustmentType) {
      case 'weather_rain':
        adjustmentInstruction = 'Heavy sudden rainstorm forecast! Swap all outdoor walking, hikes, and open-air activities for world-class indoor museums, covered artisan markets, thermal spas, or indoor cultural tasting rooms.';
        break;
      case 'weather_heatwave':
        adjustmentInstruction = 'Extreme heat advisory! Shift strenuous outdoor activities to early morning/evening and substitute mid-day slots with air-conditioned art galleries, underground shopping networks, and relaxing indoor spots.';
        break;
      case 'low_energy':
        adjustmentInstruction = 'The traveller feels exhausted and wants a slow, relaxed, soothing pace. Remove rushed transitions, reduce activity count, and introduce scenic cafe sitting, tranquil gardens, or peaceful scenic cruises.';
        break;
      case 'high_energy':
        adjustmentInstruction = 'Traveller feels ultra-energetic and adventurous! Add thrilling viewpoints, hidden alleyway explorations, vibrant night bazaars, or active outdoor exploration.';
        break;
      case 'delay_delay':
        adjustmentInstruction = '3-hour flight/train transit delay encountered! Push back afternoon timing, streamline the schedule to preserve the absolute top highlight, and reschedule dinner reservations safely.';
        break;
      case 'custom':
      default:
        adjustmentInstruction = customPrompt || 'Optimize itinerary for comfort and local highlights.';
        break;
    }

    if (!ai) {
      // Local fallback adjustment
      const updatedTrip = { ...currentTrip };
      updatedTrip.lastAdjustedReason = adjustmentInstruction;
      if (adjustmentType === 'weather_rain') {
        updatedTrip.weatherAlertActive = '🌧️ Heavy Rain Alert: Outdoor activities swapped for indoor covered experiences.';
        updatedTrip.itinerary = updatedTrip.itinerary.map((day: DayItinerary) => ({
          ...day,
          weatherForecast: { condition: 'rainy' as const, tempC: 18, description: 'Rain showers throughout the day' },
          activities: day.activities.map((act) =>
            act.weatherSuitability === 'outdoor'
              ? {
                  ...act,
                  title: `[Rain-Proof] ${act.title.replace('Walk', 'Art Museum').replace('Hike', 'Covered Gallery')}`,
                  description: `Substituted with an acclaimed indoor cultural space & covered arcade due to rain.`,
                  weatherSuitability: 'indoor' as const,
                }
              : act
          ),
        }));
      } else if (adjustmentType === 'low_energy') {
        updatedTrip.lastAdjustedReason = '🥱 Relaxed Pace Mode: Rest pauses and leisurely cafes prioritized.';
        updatedTrip.itinerary = updatedTrip.itinerary.map((day: DayItinerary) => ({
          ...day,
          activities: day.activities.slice(0, 3).map((act, i) =>
            i === 1
              ? {
                  ...act,
                  title: `Leisurely Herbal Tea & Scenic Rest Pause`,
                  description: `Take an unhurried rest in a tranquil garden cafe overlooking the city.`,
                  category: 'relaxation' as const,
                  weatherSuitability: 'indoor' as const,
                }
              : act
          ),
        }));
      }
      return res.json({
        trip: updatedTrip,
        explanation: `Updated your trip according to: "${adjustmentInstruction}"`,
      });
    }

    const prompt = `
You are WanderPulse AI. The user has an active itinerary in ${currentTrip.destination} and needs an agile real-time adjustment.
Adjustment request: "${adjustmentInstruction}"

Here is the current itinerary JSON:
${JSON.stringify(currentTrip.itinerary, null, 2)}

Provide an adjusted itinerary adhering strictly to the user request.
Return ONLY valid JSON with:
{
  "explanation": "Brief, helpful summary of changes made and why",
  "weatherAlertActive": "Optional short warning banner string if weather related, otherwise null",
  "adjustedItinerary": [
    ... same structure of DayItinerary with dayNumber, title, theme, weatherForecast, activities
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const updatedTrip: TripPlan = {
      ...currentTrip,
      itinerary: parsed.adjustedItinerary || currentTrip.itinerary,
      weatherAlertActive: parsed.weatherAlertActive || (adjustmentType.startsWith('weather') ? 'Live Weather Adaptive Route Active' : undefined),
      lastAdjustedReason: adjustmentInstruction,
    };

    return res.json({
      trip: updatedTrip,
      explanation: parsed.explanation || 'Itinerary dynamically adjusted!',
    });
  } catch (error: any) {
    console.error('Error adjusting itinerary:', error);
    return res.status(500).json({ error: error?.message || 'Failed to adjust itinerary' });
  }
});

// 3. Smart AI Chatbot Concierge endpoint (Canvas Page 4: "Customer relationships: Use smart AI chatbot for queries, customer on demand, automated follow-up")
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, tripContext } = req.body;
    const lastUserMessage = messages?.[messages.length - 1]?.text || 'Hello WanderPulse';

    if (!ai) {
      // Intelligent fallback responses based on keywords
      let reply = `I'm your 24/7 WanderPulse Concierge for ${tripContext?.destination || 'your trip'}. How can I assist you right now?`;
      const lower = lastUserMessage.toLowerCase();

      if (lower.includes('rain') || lower.includes('weather')) {
        reply = `AccuWeather partner report for ${tripContext?.destination || 'your destination'}: Expect moderate conditions today. If it rains, tap "Rain Safe Mode" in the Dynamic Journey adjustment bar to automatically reroute outdoor stops to indoor highlights!`;
      } else if (lower.includes('food') || lower.includes('eat') || lower.includes('ramen') || lower.includes('dinner')) {
        reply = `For dinner near your scheduled Day 1 activities, I recommend checking our partner dining guide. Show your WanderPulse booking code for a complimentary chef tasting welcome drink! Would you like me to reserve a table?`;
      } else if (lower.includes('pass') || lower.includes('qr') || lower.includes('flight') || lower.includes('boarding')) {
        reply = `All your digital passes (Flight, Hotel Key, Attraction FastPass, and Metro Card) are accessible in the 'Travel Passes' wallet tab above. You can tap any pass to present the full screen QR code.`;
      } else if (lower.includes('emergency') || lower.includes('police') || lower.includes('hospital')) {
        reply = `Emergency Contacts for ${tripContext?.destination || 'your destination'}: Police: ${tripContext?.mustKnows?.emergencyContacts?.police || '112'}, Medical/Ambulance: ${tripContext?.mustKnows?.emergencyContacts?.ambulance || '112'}. Your Allianz Global Policy is active (Policy #WP-INS-6621-MED, 24/7 hotline: +1-800-555-HELP).`;
      }

      return res.json({
        reply,
        quickActions: [
          { label: '🌧️ Reroute for Rain', action: 'adjust_rain' },
          { label: '🎫 Open Pass Wallet', action: 'open_passes' },
          { label: '💡 Local Etiquette Tips', action: 'show_tips' },
        ],
      });
    }

    const contextPrompt = tripContext
      ? `You are WanderPulse Concierge, a helpful 24/7 AI travel companion. The user is currently planning or on a trip to ${tripContext.destination} (${tripContext.durationDays} days, ${tripContext.persona} persona, budget: ${tripContext.budgetTier}).
Key partners include Airlines (Singapore Airlines, etc.), Hotels/Airbnb, Klook, Allianz Insurance, and local weather networks.
Respond warmly, concisely, and practically with specific tips, local insights, directions, or trip edits.
Keep answers under 3 paragraphs with bullet points if helpful.`
      : `You are WanderPulse Concierge, an expert travel planning assistant. Answer warmly and concisely.`;

    const chatResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${contextPrompt}\n\nUser Question: ${lastUserMessage}` }] },
      ],
      config: {
        temperature: 0.7,
      },
    });

    return res.json({
      reply: chatResponse.text || "I'm here to help with your trip! What would you like to explore next?",
      quickActions: [
        { label: '🔄 Adjust Day Pace', action: 'adjust_pace' },
        { label: '🎫 View Digital Passes', action: 'open_passes' },
        { label: '🛡️ Check Travel Advisory', action: 'show_advisory' },
      ],
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    return res.json({
      reply: "I'm with you on your journey! How can I help refine your travel plans today?",
      quickActions: [{ label: '🎫 Open Passes', action: 'open_passes' }],
    });
  }
});

// Serverless OneMap SG, Bus Arrival, and Health check endpoints
import healthHandler from './api/health.ts';
import busArrivalHandler from './api/busarrival.ts';
import oneMapHandler from './api/onemap.ts';

app.all('/api/health', (req, res) => healthHandler(req, res));
app.all('/api/busarrival', (req, res) => busArrivalHandler(req, res));
app.all('/api/onemap', (req, res) => oneMapHandler(req, res));
app.all('/api/onemap/search', (req, res) => oneMapHandler(req, res));

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WanderPulse AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

