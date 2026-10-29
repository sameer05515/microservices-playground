# Revision Reminder — Node.js + EJS

A small local web app to help you revise one topic at a time.

## Features
- Dashboard showing due topics, total topics, and topics reviewed today
- Add topics with category and notes
- Mark a topic as reviewed
- Spaced review intervals: 1, 3, 7, 14, and 30 days
- Snooze a topic for two hours
- Delete topics
- JSON file persistence (`data/topics.json`)
- Browser notifications and configurable daily reminder time
- Responsive layout for desktop and mobile

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000

For auto-restart while developing:
```bash
npm install
npm run dev
```

## Data storage
Topics are stored in `data/topics.json`; reminder settings are stored in `data/settings.json`. Back up these files before changing or deleting them.

## Notifications
Click **Enable browser reminders** and allow notifications. The app checks for reminders while the dashboard is open. Browser notifications will not fire when the browser/app is closed; this starter app does not include a background scheduler or email/SMS delivery.

## Suggested starter topics
- Java Collections
- HashMap internals
- Java 8 Streams
- Multithreading
- Spring Dependency Injection
- Spring Boot REST APIs
- Microservices: Saga, Circuit Breaker, DLQ
- SQL joins and window functions
- React hooks
- System design fundamentals

## Project structure
```text
revision-reminder/
├── data/
│   ├── settings.json
│   └── topics.json
├── public/
│   ├── app.js
│   └── styles.css
├── views/
│   └── index.ejs
├── package.json
├── server.js
└── README.md
```
