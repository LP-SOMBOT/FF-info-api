const { getPlayerInfo } = require('../lib/freefire');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // API key check
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY;
  if (validKey && apiKey !== validKey) {
    return res.status(401).json({ error: 'Invalid or missing API key. Pass x-api-key header.' });
  }

  const { uid, region } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'uid parameter is required.' });
  }

  const regionCode = (region || 'SG').toUpperCase();

  try {
    const data = await getPlayerInfo(uid, regionCode);
    if (!data || !data.AccountName) {
      return res.status(404).json({ error: 'Player not found. Check UID or region.' });
    }
    return res.status(200).json({
      success: true,
      uid,
      region: regionCode,
      AccountName: data.AccountName,
      AccountLevel: data.AccountLevel || null,
      AccountRegion: data.AccountRegion || regionCode,
      AccountLikes: data.AccountLikes || null,
    });
  } catch (err) {
    console.error('Lookup error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch player info. Try again.' });
  }
};
