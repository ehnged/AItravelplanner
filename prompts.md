# Project Prompts & Conversation History Log

This document collates all prompts executed in the session, including user instructions, repository operations, and the internal AI model prompts configured within the application.

---

## 1. User & Session Directives

### Prompt 1: Initial Import & Migration
**Prompt:**
> "This app was imported from GitHub repository ehnged/AItravelplanner."

**Context & Actions Executed:**
- Executed migration protocol per `github-import-migration` skill for Node.js runtime.
- Audited project structure, dependencies, and configuration.
- Verified and aligned Express server (`server.ts`) with Vite SPA middleware mounting on port 3000 (`0.0.0.0`).
- Configured live API endpoints (`/api/weather`, `/api/forecast`, `/api/health`, `/api/busarrival`).
- Added `GEMINI_API_KEY=` to `.env.example` and supported dual env var detection (`GEMINI_API_KEY` / `API_KEY`).
- Compiled and linted the applet cleanly.

---

### Prompt 2: Git Remote Push
**Prompt:**
> `git push <GITHUB_TOKEN>@https://github.com/ehnged/AItravelplanner.git HEAD:hafidz`

**Context & Actions Executed:**
- Initialized local Git repository and staged all files with `.gitignore` filtering.
- Rebased working tree cleanly on top of `origin/hafidz` (`commit 5bed8fd`).
- Committed migration updates (`commit 2f6f4b0`).
- Pushed changes to branch `hafidz` on `https://github.com/ehnged/AItravelplanner.git`.
- Sanitized access token from local git remote URLs.

---

### Prompt 3: UI Adjustment, Git Push & Prompts Collation
**Prompt:**
> "remove the 24/7 support at the top page
> 
> git push <GITHUB_TOKEN>@https://github.com/ehnged/AItravelplanner.git HEAD:hafidz
> 
> collate all the prompts that you have ran so far and store it in a prompts.md"

**Context & Actions Executed:**
- Removed the "24/7 Support" link and icon from the top utility bar in `src/components/Navbar.tsx`.
- Created `prompts.md` logging all user prompts, execution actions, and AI prompts.
- Committed changes and pushed to branch `hafidz`.

---

## 2. Core Application AI Prompts (Gemini 3.8 Flash)

Below are the internal prompt templates used by the server to drive the AI features:

### A. Intelligent Itinerary Generation (`POST /api/generate-plan`)
```text
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
  "mustKnows": { ... },
  "advisory": { ... },
  "passes": [ ... ],
  "followUps": [ ... ],
  "partnerPerks": [ ... ]
}
```

### B. Dynamic Real-Time Journey Adjustment (`POST /api/adjust-itinerary`)
```text
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
```

### C. 24/7 Smart Travel Concierge (`POST /api/chat`)
```text
You are WanderPulse Concierge, a helpful 24/7 AI travel companion. The user is currently planning or on a trip to ${tripContext.destination} (${tripContext.durationDays} days, ${tripContext.persona} persona, budget: ${tripContext.budgetTier}).
Key partners include Airlines (Singapore Airlines, etc.), Hotels/Airbnb, Klook, Allianz Insurance, and local weather networks.
Respond warmly, concisely, and practically with specific tips, local insights, directions, or trip edits.
Keep answers under 3 paragraphs with bullet points if helpful.

User Question: ${lastUserMessage}
```
