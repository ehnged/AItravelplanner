import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const busStopCode =
      (req.query.BusStopCode as string) ||
      (req.query.busStopCode as string) ||
      (req.query.bus_stop_code as string) ||
      '01012';
    const serviceNo = (req.query.ServiceNo as string) || (req.query.serviceNo as string);

    // API Key read securely from environment variable (never hardcoded)
    const apiKey =
      process.env.LTA_API_KEY ||
      process.env.DATAMALL_API_KEY ||
      process.env.BUS_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        source: 'simulated-fallback',
        apiKeyConfigured: false,
        message:
          'LTA DataMall API Key is not configured yet. Set LTA_API_KEY in environment variables to pull live data.',
        BusStopCode: busStopCode,
        Services: [
          {
            ServiceNo: serviceNo || '10',
            Operator: 'SBST',
            NextBus: {
              OriginCode: '01012',
              DestinationCode: '16009',
              EstimatedArrival: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
              Latitude: '1.2931',
              Longitude: '103.8532',
              VisitNumber: '1',
              Load: 'SEA', // Seats Available
              Feature: 'WAB', // Wheelchair Accessible Bus
              Type: 'DD', // Double Deck
            },
            NextBus2: {
              OriginCode: '01012',
              DestinationCode: '16009',
              EstimatedArrival: new Date(Date.now() + 11 * 60 * 1000).toISOString(),
              Latitude: '1.2985',
              Longitude: '103.8580',
              VisitNumber: '1',
              Load: 'SDA', // Standing Available
              Feature: 'WAB',
              Type: 'SD', // Single Deck
            },
          },
          {
            ServiceNo: '100',
            Operator: 'SBST',
            NextBus: {
              OriginCode: '01012',
              DestinationCode: '03218',
              EstimatedArrival: new Date(Date.now() + 6 * 60 * 1000).toISOString(),
              Latitude: '1.2910',
              Longitude: '103.8510',
              VisitNumber: '1',
              Load: 'SEA',
              Feature: 'WAB',
              Type: 'SD',
            },
          },
        ],
      });
    }

    // Live call to Singapore LTA DataMall
    let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
    if (serviceNo) {
      targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    const response = await fetch(targetUrl, {
      headers: {
        AccountKey: apiKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: 'Failed to fetch from LTA DataMall API',
        status: response.status,
        details: errText,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      success: true,
      source: 'lta-datamall',
      apiKeyConfigured: true,
      ...data,
    });
  } catch (error: any) {
    console.error('Error fetching bus arrival data:', error);
    return res.status(500).json({
      error: 'Internal server error while retrieving bus arrival data',
      message: error?.message || 'Unknown error',
    });
  }
}
