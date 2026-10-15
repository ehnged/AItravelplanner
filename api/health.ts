import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: 'SmartTravel Serverless API',
    endpoints: {
      health: '/api/health',
      weather: '/api/weather',
      forecast: '/api/forecast',
      busArrival: '/api/busarrival',
    },
  });
}
