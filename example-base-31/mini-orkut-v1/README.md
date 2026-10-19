# Mini Orkut V1

An Orkut-inspired social networking mini-project using Node.js, Express, EJS and JSON-file storage.

## Features
- Registration/login with bcrypt password hashing and server-side sessions
- User profiles (bio, location, interests)
- Post and delete scraps
- Search members by name, username or location
- Send, accept and decline friend requests
- Friends list
- Join/leave seeded communities
- Responsive CSS for desktop and mobile
- JSON persistence in `data/db.json`

## Run
1. Install Node.js 18 or later.
2. Copy `.env.example` to `.env` and change `SESSION_SECRET`.
3. Run `npm install`
4. Run `npm run dev` or `npm start`
5. Open http://localhost:3000

Data is created automatically in `data/db.json`. JSON-file storage and Express's default in-memory session store are for local learning/demo use, not production. Before public deployment, add CSRF protection, rate limiting, persistent sessions, robust validation and a production database.
