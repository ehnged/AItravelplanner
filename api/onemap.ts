import type { Request, Response } from 'express';

interface OneMapSearchParams {
  searchVal?: string;
  returnGeom?: string;
  getAddrDetails?: string;
  pageNum?: string | number;
}

export default async function handler(req: Request, res: Response) {
  try {
    const query = (req.query || {}) as OneMapSearchParams;
    const body = (req.body || {}) as OneMapSearchParams;

    // Default to the user's specified example searchVal '178903' if none supplied
    const searchVal = query.searchVal || body.searchVal || '178903';
    const returnGeom = query.returnGeom || body.returnGeom || 'Y';
    const getAddrDetails = query.getAddrDetails || body.getAddrDetails || 'Y';
    const pageNum = String(query.pageNum || body.pageNum || '1');

    const targetUrl = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
    targetUrl.searchParams.set('searchVal', searchVal);
    targetUrl.searchParams.set('returnGeom', returnGeom);
    targetUrl.searchParams.set('getAddrDetails', getAddrDetails);
    targetUrl.searchParams.set('pageNum', pageNum);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'OneMap-SG-WanderPulse/1.0',
    };

    // Do not hardcode any key; inject from environment if provided by the user
    const apiKey = process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN;
    if (apiKey) {
      headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
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
        error: `OneMap API responded with status ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('OneMap SG proxy error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to connect to OneMap SG',
    });
  }
}
