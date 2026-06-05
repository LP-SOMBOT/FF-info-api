/**
 * Free Fire Player Info Fetcher
 * Multiple sources with automatic fallback
 */

const REGION_MAP = {
  SG: 'SG', ME: 'ME', IND: 'IND', ID: 'ID',
  BD: 'BD', BR: 'BR', PK: 'PK', US: 'US',
  NA: 'NA', SAC: 'SAC', VN: 'VN', TH: 'TH',
  TW: 'TW', CIS: 'CIS', EU: 'EU', MY: 'MY',
};

// Source 1 — free-ff-api (most reliable)
async function trySource1(uid, region) {
  try {
    const url = `https://free-ff-api-src-5plp.onrender.com/api/v1/account?region=${region}&uid=${uid}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 12) Chrome/112.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.basicInfo?.nickname) {
      return {
        AccountName: data.basicInfo.nickname,
        AccountLevel: data.basicInfo.level || null,
        AccountRegion: region,
        AccountLikes: data.basicInfo.liked || null,
      };
    }
    if (data?.AccountInfo?.AccountName) {
      return {
        AccountName: data.AccountInfo.AccountName,
        AccountLevel: data.AccountInfo.AccountLevel || null,
        AccountRegion: region,
        AccountLikes: data.AccountInfo.AccountLikes || null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Source 2 — freefireinfo community API
async function trySource2(uid, region) {
  try {
    // Map region to the correct server group this API uses
    let server = 'SG';
    if (region === 'IND') server = 'IND';
    else if (['BR', 'US', 'SAC', 'NA'].includes(region)) server = 'BR';
    else if (region === 'BD') server = 'BD';

    const url = `https://freefireinfo-zy9l.onrender.com/api/v1/player-profile?uid=${uid}&server=${server.toLowerCase()}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.nickname || data?.name) {
      return {
        AccountName: data.nickname || data.name,
        AccountLevel: data.level || null,
        AccountRegion: region,
        AccountLikes: data.likes || null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Source 3 — alternate free-ff endpoint
async function trySource3(uid, region) {
  try {
    const url = `https://free-ff-api-src-5plp.onrender.com/api/v1/playerstats?region=${region}&uid=${uid}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 12) Chrome/112.0' },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.AccountInfo?.AccountName) {
      return {
        AccountName: data.AccountInfo.AccountName,
        AccountLevel: data.AccountInfo.AccountLevel || null,
        AccountRegion: region,
        AccountLikes: data.AccountInfo.AccountLikes || null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

const FALLBACK_ORDER = ['SG', 'ME', 'IND', 'ID', 'BD', 'BR', 'PK', 'US', 'VN', 'TH'];

async function getPlayerInfo(uid, region = 'SG') {
  const r = (REGION_MAP[region.toUpperCase()] || region.toUpperCase());

  // Try all 3 sources with the requested region in parallel for speed
  const results = await Promise.allSettled([
    trySource1(uid, r),
    trySource2(uid, r),
    trySource3(uid, r),
  ]);

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value?.AccountName) {
      return result.value;
    }
  }

  // If all sources failed with the given region, try other regions with source 1
  for (const fallback of FALLBACK_ORDER) {
    if (fallback === r) continue;
    const result = await trySource1(uid, fallback);
    if (result?.AccountName) return result;
  }

  return null;
}

module.exports = { getPlayerInfo, REGION_MAP };
