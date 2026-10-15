import type { Request, Response } from 'express';

interface RevGeocodeParams {
  location?: string;
  lat?: string | number;
  lng?: string | number;
  latitude?: string | number;
  longitude?: string | number;
  buffer?: string | number;
  addressType?: string;
  otherFeatures?: string;
}

export default async function handler(req: Request, res: Response) {
  try {
    const query = (req.query || {}) as RevGeocodeParams;
    const body = (req.body || {}) as RevGeocodeParams;

    // Parse location coordinates (e.g., '1.2979,103.8489' or separate lat/lng)
    let location = query.location || body.location;
    if (!location) {
      const lat = query.lat || query.latitude || body.lat || body.latitude;
      const lng = query.lng || query.longitude || body.lng || body.longitude;
      if (lat && lng) {
        location = `${lat},${lng}`;
      } else {
        location = '1.2979,103.8489'; // Default SMU / Bras Basah reference location
      }
    }

    const buffer = String(query.buffer || body.buffer || '40');
    const addressType = String(query.addressType || body.addressType || 'All');
    const otherFeatures = String(query.otherFeatures || body.otherFeatures || 'N');

    const targetUrl = new URL('https://www.onemap.gov.sg/api/public/revgeocode');
    targetUrl.searchParams.set('location', location);
    targetUrl.searchParams.set('buffer', buffer);
    targetUrl.searchParams.set('addressType', addressType);
    targetUrl.searchParams.set('otherFeatures', otherFeatures);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'OneMap-SG-WanderPulse/1.0',
    };

    // Use environment variable or client-supplied authorization header; do not hardcode keys
    const incomingAuth = req.headers.authorization;
    const envToken = process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN;
    const token = incomingAuth || envToken;

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const response = await fetch(targetUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        status: response.status,
        error: `OneMap RevGeocode responded with status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('OneMap SG RevGeocode proxy error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to connect to OneMap SG RevGeocode',
    });
  }
}
