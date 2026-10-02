# Revision Dashboard V3

Node.js + Express + Alpine.js + Tailwind CSS revision dashboard.

## V3 change

V1/V2 stored progress in browser LocalStorage.

V3 stores:

- completed status
- important/star status
- revision notes

in:

```text
data/topics.json
```

The browser only calls REST APIs.

## Requirements

- Node.js 18+ recommended
- npm

## Run

```powershell
cd revision-dashboard-v3
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Development

```powershell
npm run dev
```

## REST API

### Get all topics

```http
GET /api/topics
```

### Update topic

```http
PUT /api/topics/:id
Content-Type: application/json

{
  "done": true,
  "important": true,
  "notes": "Revise HashMap resize and treeification."
}
```

### Reset

```http
POST /api/reset
```

### Health

```http
GET /api/health
```

## Architecture

```text
Browser
   |
   | Alpine.js / fetch()
   v
Express Server
   |
   +---- GET /api/topics
   |
   +---- PUT /api/topics/:id
   |
   +---- POST /api/reset
   |
   v
data/topics.json
```

No database is required.
