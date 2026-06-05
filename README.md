# Free Fire Info API

A lightweight Free Fire player lookup API. Deploy free on Vercel.

## Endpoints

### `GET /api/player`

Returns player name and info by UID.

**Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| uid | Yes | Free Fire player UID |
| region | No | Region code (default: SG) |

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| x-api-key | Only if API_KEY env is set | Your secret key |

**Example request:**
```
GET /api/player?uid=2312730961&region=SG
x-api-key: your_key
```

**Example response:**
```json
{
  "success": true,
  "uid": "2312730961",
  "region": "SG",
  "AccountName": "PlayerNickname",
  "AccountLevel": 65,
  "AccountRegion": "SG",
  "AccountLikes": 1200
}
```

## Supported Regions
`SG` `ME` `IND` `ID` `BD` `BR` `PK` `US` `VN` `TH` `TW` `CIS` `EU` `MY`

For Somalia 🇸🇴 use `SG` (Singapore server).

## Deploy to Vercel

1. Fork or upload this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. No build settings needed
4. Optionally set `API_KEY` in Vercel environment variables
5. Deploy — your API is live at `https://your-project.vercel.app`

## Use in OskarShop

```js
const res = await fetch(
  'https://your-api.vercel.app/api/player?uid=PLAYER_UID&region=SG',
  { headers: { 'x-api-key': 'your_key' } }
)
const data = await res.json()
console.log(data.AccountName) // Player nickname
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| API_KEY | No | Secret key to protect your API |
