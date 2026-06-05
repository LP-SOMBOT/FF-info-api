module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    name: 'OskarShop Free Fire Info API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      player_lookup: {
        method: 'GET',
        path: '/api/player',
        params: {
          uid: 'required — Free Fire player UID',
          region: 'optional — SG (default), ME, IND, ID, BD, BR, PK, US, VN, TH',
        },
        headers: {
          'x-api-key': 'required if API_KEY env var is set',
        },
        example: '/api/player?uid=2312730961&region=SG',
      },
    },
    regions_supported: [
      'SG', 'ME', 'IND', 'ID', 'BD', 'BR',
      'PK', 'US', 'NA', 'SAC', 'VN', 'TH', 'TW', 'CIS', 'EU', 'MY'
    ],
    docs: 'https://github.com/yourusername/ff-info-api',
  });
};
