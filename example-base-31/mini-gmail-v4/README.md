# Mini Gmail v4

A Gmail-inspired email application built with Node.js, Express, EJS and MongoDB.

## Features

- User registration/login
- JWT authentication using HTTP-only cookie
- bcrypt password hashing
- Inbox, Sent, Drafts, Starred, Important and Trash
- Search
- Pagination
- Read/unread
- Star/unstar
- Important marker
- Reply and Forward
- Multiple recipients: To, Cc, Bcc
- File attachments
- Contacts
- MongoDB + Mongoose
- REST API with Bearer token
- Docker Compose for MongoDB
- Gmail-style responsive UI
- Fixed dotenv dependency

## Run

```bash
npm install
copy .env.example .env
docker compose up -d
node seed.js
npm run dev
```

Open http://localhost:3000

Demo users:

- prem@gmail.com / 123456
- demo@gmail.com / 123456
- admin@gmail.com / 123456

## API

Obtain a JWT by using the login flow or by adapting the auth service for an API login endpoint.

Examples:

- GET `/api/stats`
- GET `/api/mail/inbox`
- GET `/api/mail/sent`

Send the token as:

```text
Authorization: Bearer <JWT>
```

## Attachment limit

Default maximum is 10 MB per file and up to 5 files per message.

Configure with `MAX_FILE_SIZE_MB` in `.env`.
