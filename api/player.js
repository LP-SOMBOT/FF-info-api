const { getPlayerInfo } = require('../lib/freefire');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional API key protection
  const validKey = process.env.API_KEY;
  if (validKey) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== validKey) {
      return res.status(401).json({ error: 'Invalid or missing API key.' });
    }
  }

  const { uid, region } = req.query;

  if (!uid || uid.trim().length < 5) {
    return res.status(400).json({ error: 'uid parameter is required and must be valid.' });
  }

  const regionCode = (region || 'SG').toUpperCase();

  try {
    const data = await getPlayerInfo(uid.trim(), regionCode);

    if (!data || !data.AccountName) {
      return res.status(404).json({
        error: 'Player not found. Check UID or try a different region.',
        tried_region: regionCode,
      });
    }

    return res.status(200).json({
      success: true,
      uid: uid.trim(),
      region: data.AccountRegion || regionCode,
      AccountName: data.AccountName,
      AccountLevel: data.AccountLevel,
      AccountLikes: data.AccountLikes,
    });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Lookup failed. Please try again.' });
  }
};
