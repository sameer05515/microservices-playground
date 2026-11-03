# Revision Tracker (Node.js + Express + EJS + JSON)

A simple personal revision tracker for the weekly routine:
- Monday / Wednesday / Friday: Java coding + interview preparation
- Tuesday / Thursday / Saturday: JavaScript coding + interview preparation
- Sunday: Rest and retrospection

## Features
- Date-wise daily checklist generated from the weekly schedule
- Track coding minutes, problems solved and interview questions practiced
- Save daily learning notes
- Weekly progress percentage and day-wise overview
- Sunday retrospective: wins, challenges and next week's focus
- Revision history
- Data persists locally in `data/tracker.json` (no database required)

## Run locally
Requires Node.js 18+.

```bash
npm install
npm start
```

Open http://localhost:3000

For auto-restart during development:

```bash
npm install
npm run dev
```

## Storage
All records are stored in `data/tracker.json`. Back up this file to preserve your history.

## Project structure
```text
revision-tracker-ejs/
├── data/
│   └── tracker.json
├── public/
│   └── styles.css
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── history.ejs
│   └── index.ejs
├── package.json
├── server.js
└── README.md
```
