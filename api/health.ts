import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'OneMap SG & Singapore Smart Transit API',
      version: '1.0.0',
      uptime: process.uptime(),
      integrations: {
        oneMap: {
          configured: Boolean(process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN),
          searchEndpoint: 'https://www.onemap.gov.sg/api/common/elastic/search',
          revGeocodeEndpoint: 'https://www.onemap.gov.sg/api/public/revgeocode',
        },
        ltaBusArrival: {
          configured: Boolean(process.env.LTA_API_KEY || process.env.DATAMALL_API_KEY),
          endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2',
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error?.message || 'Internal health check failure',
    });
  }
}
