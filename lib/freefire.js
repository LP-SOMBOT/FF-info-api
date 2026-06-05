/**
 * Free Fire Player Info Fetcher
 * Uses Garena's public profile endpoint
 */

const REGIONS = {
  SG: 'sg',
  ID: 'id',
  IND: 'ind',
  BD: 'bd',
  PK: 'pk',
  BR: 'br',
  US: 'us',
  NA: 'na',
  SAC: 'sac',
  ME: 'me',
  VN: 'vn',
  TH: 'th',
  TW: 'tw',
  CIS: 'cis',
  EU: 'eu',
  MY: 'my',
};

const REGION_FALLBACK_ORDER = ['SG', 'ME', 'IND', 'ID', 'BD', 'BR', 'PK', 'US'];

async function fetchFromRegion(uid, region) {
  const regionKey = REGIONS[region] || region.toLowerCase();
  const url = `https://ff.garena.com/api/heroes/summary?uid=${uid}&region=${regionKey}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/91.0 Mobile Safari/537.36',
      'Accept': 'application/json',
      'Referer': 'https://ff.garena.com/',
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

async function fetchFromAlternate(uid, region) {
  const regionKey = (REGIONS[region] || region).toLowerCase();
  const url = `https://freefireinfo.vercel.app/api?uid=${uid}&region=${regionKey}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OskarShopAPI/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.basicInfo?.nickname) {
      return {
        AccountName: data.basicInfo.nickname,
        AccountLevel: data.basicInfo.level,
        AccountRegion: region,
        AccountLikes: data.basicInfo.liked,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function getPlayerInfo(uid, region = 'SG') {
  // Try requested region first
  try {
    const direct = await fetchFromAlternate(uid, region);
    if (direct?.AccountName) return direct;
  } catch {}

  // Try fallback regions
  for (const fallbackRegion of REGION_FALLBACK_ORDER) {
    if (fallbackRegion === region) continue;
    try {
      const result = await fetchFromAlternate(uid, fallbackRegion);
      if (result?.AccountName) return result;
    } catch {}
  }

  return null;
}

module.exports = { getPlayerInfo, REGIONS };
