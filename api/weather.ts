import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const latitude = (req.query.latitude as string) || (req.query.lat as string) || '1.29';
    const longitude = (req.query.longitude as string) || (req.query.lon as string) || (req.query.lng as string) || '103.85';
    const current = (req.query.current as string) || 'temperature_2m,precipitation';
    const daily = (req.query.daily as string) || 'temperature_2m_max,precipitation_probability_max';
    const timezone = (req.query.timezone as string) || 'Asia/Singapore';

    // Optional API key read from environment variable without hardcoding
    const apiKey = process.env.OPEN_METEO_API_KEY || process.env.METEO_API_KEY;

    let targetUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=${encodeURIComponent(current)}&daily=${encodeURIComponent(daily)}&timezone=${encodeURIComponent(timezone)}`;

    if (apiKey) {
      targetUrl += `&apikey=${encodeURIComponent(apiKey)}`;
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: 'Failed to fetch data from Open-Meteo',
        status: response.status,
        details: errText,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      source: 'open-meteo',
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        timezone,
      },
      ...data,
    });
  } catch (error: any) {
    console.error('Error connecting to Open-Meteo API:', error);
    return res.status(500).json({
      error: 'Failed to fetch Open-Meteo live weather data',
      message: error?.message || 'Unknown error',
    });
  }
}
