# Focus Room — Pomodoro Revision App

A responsive Node.js + Express + EJS application that helps you revise in small focus sessions.

## Features
- Pomodoro timer: 25-minute focus, 5-minute short break, 15-minute long break
- Start, pause, reset, skip and change modes
- Select the topic being revised
- Automatically records completed 25-minute focus sessions
- Today's focus minutes and session count
- Add/delete topics with category and notes
- Browser notification and a small sound when a timer completes (notification permission is requested by browser when supported)
- JSON persistence; no database required

## Run
Requires Node.js 18+ and npm.

```bash
npm install
npm start
```
Open http://localhost:3000

Development mode:
```bash
npm install
npm run dev
```

## Storage
- `data/topics.json`: revision topics
- `data/sessions.json`: completed focus sessions

Back up these files if you want to preserve your data.

## Notes
The timer runs in the browser tab. Keep the app tab open while a session is running. This is a local starter app, not a background alarm service; browser throttling or closing the tab can affect the timer. For a 60-minute daily target, aim for two 25-minute sessions with breaks, but starting with one session—or even five minutes—is completely fine.
