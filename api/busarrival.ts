import type { Request, Response } from 'express';

interface BusArrivalQuery {
  busStopCode?: string;
  BusStopCode?: string;
  serviceNo?: string;
  ServiceNo?: string;
}

export default async function handler(req: Request, res: Response) {
  try {
    const query = (req.query || {}) as BusArrivalQuery;
    const body = (req.body || {}) as BusArrivalQuery;

    const busStopCode = query.busStopCode || query.BusStopCode || body.busStopCode || body.BusStopCode || '01012';
    const serviceNo = query.serviceNo || query.ServiceNo || body.serviceNo || body.ServiceNo;

    const apiKey = process.env.LTA_API_KEY || process.env.DATAMALL_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        warning: 'LTA DataMall API key not configured. Set LTA_API_KEY in environment variables.',
        busStopCode,
        services: [
          {
            ServiceNo: serviceNo || '190',
            Operator: 'SMRT',
            NextBus: {
              EstimatedArrival: new Date(Date.now() + 4 * 60 * 1000).toISOString(),
              Load: 'SEA',
              Feature: 'WAB',
              Type: 'SD',
            },
            NextBus2: {
              EstimatedArrival: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
              Load: 'SDA',
              Feature: 'WAB',
              Type: 'DD',
            },
            NextBus3: {
              EstimatedArrival: new Date(Date.now() + 22 * 60 * 1000).toISOString(),
              Load: 'LSD',
              Feature: 'WAB',
              Type: 'BD',
            },
          },
        ],
        source: 'stub-unconfigured-key',
      });
    }

    const url = new URL('https://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2');
    url.searchParams.set('BusStopCode', String(busStopCode));
    if (serviceNo) {
      url.searchParams.set('ServiceNo', String(serviceNo));
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        AccountKey: apiKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `LTA DataMall responded with status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      busStopCode,
      ...data,
    });
  } catch (error: any) {
    console.error('Bus arrival error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to fetch bus arrival data',
    });
  }
}
