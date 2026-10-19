# Mini Facebook V1

Facebook-inspired social networking demo built with Node.js, Express, EJS, CSS and JSON-file persistence.

## Features
- Register/login with bcrypt password hashing and sessions
- User profiles with bio and location
- Feed for your posts and friends' posts
- Create/delete posts
- Like/unlike posts and add comments
- Search people by name, username or location
- Send, accept and decline friend requests
- Friends list and notifications page
- Responsive blue-and-white UI

## Run locally
1. Install Node.js 18+
2. Copy `.env.example` to `.env` and set a long random `SESSION_SECRET`
3. Run `npm install`
4. Run `npm run dev` (or `npm start`)
5. Open http://localhost:3000

Data is stored in `data/db.json`. JSON storage and Express's default in-memory session store are for local demos only, not production. Add CSRF protection, rate limiting, persistent sessions and a production database before public deployment.
