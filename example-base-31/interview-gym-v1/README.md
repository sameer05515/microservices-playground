
# Interview Gym V1

A full-stack interview preparation app built with React + Vite, Spring Boot 3, JWT, and MySQL.
The question bank is stored in `backend/src/main/resources/questions/questions.json`; user accounts and progress are stored in MySQL.

## Features
- JWT signup/login and protected APIs
- Category-filtered question bank: Java, Spring Boot, React, SQL, Microservices, System Design
- Markdown answers, code blocks and tables via `react-markdown` + `remark-gfm`
- Practice mode: reveal answer, self-rate, next/previous question
- Progress dashboard: attempts, correct/needs-review counts, accuracy, category breakdown
- Admin-like question management for any authenticated user (V1 is personal-use; add roles before public deployment)
- JSON question-bank export/import (import replaces the file on the server; protect this endpoint before public deployment)
- Unit tests for core backend service and frontend smoke tests
- Docker Compose for MySQL

## Requirements
- Java 17+
- Node.js 20+
- npm
- Docker Desktop (recommended) or MySQL 8

## Quick start

### 1. Start MySQL
```bash
docker compose up -d mysql
```

### 2. Start backend
Windows PowerShell:
```powershell
cd backend
$env:DB_URL="jdbc:mysql://localhost:3306/interview_gym?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME="interview_user"
$env:DB_PASSWORD="interview_pass"
$env:JWT_SECRET="change-this-demo-secret-to-a-long-random-secret-at-least-32-chars"
mvn spring-boot:run
```
macOS/Linux:
```bash
cd backend
export DB_URL='jdbc:mysql://localhost:3306/interview_gym?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC'
export DB_USERNAME='interview_user'
export DB_PASSWORD='interview_pass'
export JWT_SECRET='change-this-demo-secret-to-a-long-random-secret-at-least-32-chars'
mvn spring-boot:run
```
Backend: http://localhost:8080

### 3. Start frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

### 4. Use the app
1. Sign up from the login screen.
2. Browse categories or use Practice mode.
3. Reveal answers and rate your attempt.
4. Review the dashboard for progress.
5. Open Manage Questions to maintain the bank.

## API overview
- `POST /api/auth/signup` — `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login` — `{ "email": "...", "password": "..." }`
- `GET /api/questions?category=Java&search=hashmap`
- `POST /api/questions`, `PUT /api/questions/{id}`, `DELETE /api/questions/{id}`
- `GET /api/progress`
- `POST /api/progress` — `{ "questionId": "...", "rating": "GOT_IT|NEEDS_REVIEW" }`
- `GET /api/questions/export`
- `POST /api/questions/import` — accepts JSON array, replaces question bank

All routes except auth routes require `Authorization: Bearer <token>`.

## Notes and production hardening
- The JSON question bank is shared by all users. Concurrent edits are synchronized in-process and written atomically, but this is not a multi-instance storage strategy.
- This V1 lets any authenticated user manage the shared question bank and import/export it. For a public multi-user deployment, add roles/ownership, restrict import/export to admins, use refresh-token rotation, rate limiting, email verification, HTTPS, secret management, and audit logging.
- Set `JWT_SECRET` to a long random secret in every environment. The default is for local development only.
- Do not expose the development MySQL credentials publicly.
