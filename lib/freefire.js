async function getPlayerInfo(uid, region = 'ME') {
  const r = region.toUpperCase();

  try {
    const url = `https://ff-info-api-xyz.vercel.app/api/Flex-ff-Info?region=${r}&uid=${uid}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (data?.basicInfo?.nickname) {
      return {
        AccountName: data.basicInfo.nickname,
        AccountLevel: data.basicInfo.level || null,
        AccountRegion: data.basicInfo.region || r,
        AccountLikes: data.basicInfo.liked || null,
        AccountRank: data.basicInfo.rankingPoints || null,
        ClanName: data.clanBasicInfo?.clanName || null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

module.exports = { getPlayerInfo };
