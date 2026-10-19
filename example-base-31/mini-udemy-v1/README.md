# Mini Udemy V1

A Udemy-inspired learning platform built with Node.js, Express, EJS, CSS and JSON-file persistence.

## Features
- Register/login with bcrypt password hashing and session authentication
- Search courses by title, instructor, category or description
- Filter by course category
- Course details, curriculum, instructor and pricing
- Demo enrollment (no payment gateway)
- Lesson viewer with lesson navigation and completion tracking
- My Learning dashboard with progress bars
- Course reviews and ratings
- Responsive layout
- Seeded JavaScript, Spring Boot, HTML/CSS and SQL courses

## Run locally
1. Install Node.js 18+
2. Copy `.env.example` to `.env` and set a long random `SESSION_SECRET`
3. Run `npm install`
4. Run `npm run dev` (or `npm start`)
5. Open http://localhost:3000

Course/user data is stored in `data/db.json`. Enrolment is a demo action; this version does not process payments or stream real video. Lesson pages display text-based learning content. JSON storage and Express's default in-memory session store are for local demos only. For production, add CSRF protection, rate limiting, persistent sessions, a database, secure deployment settings and a payment provider if selling courses.
