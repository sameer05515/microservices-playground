# Revision Starter — Node.js + EJS

A gentle revision app designed to make starting easy, without a large daily target.

## Features
- 10, 15, and 25-minute focus timer
- Start, pause, and reset
- Select a revision topic to focus on
- Add, complete, and delete topics
- Logs completed focus sessions to `data/sessions.json`
- Daily minutes, today's sessions, and all-time session counts
- Responsive layout and low-pressure revision method
- Browser notification and a short sound when a session finishes (where supported)

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000

For automatic server restarts while developing:
```bash
npm run dev
```

## How to revise with it
1. Pick the easiest topic, not the most intimidating one.
2. Click the topic to load its suggested duration, or use the 10-minute button.
3. Read for 3 minutes, close your notes and recall for 4 minutes, then check gaps for 3 minutes.
4. If you finish, mark the topic done or log another short session. Stopping after one session is okay.

## Storage and limitations
Topics and session logs are stored in local JSON files under `data/`. This is intended for one local user, not concurrent production traffic. The timer runs in the browser tab, so keep the tab open while a session is active. Date aggregation uses the server's current date.
