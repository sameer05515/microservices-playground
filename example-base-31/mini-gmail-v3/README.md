# Mini Gmail v3

Mini Gmail v3 is a more realistic Node.js application using:

- Node.js
- Express
- EJS
- MongoDB
- Mongoose
- JWT
- HTTP-only cookie authentication
- bcrypt password hashing
- REST-style API
- Pagination
- Search
- Drafts
- Starred
- Trash
- Reply / Forward
- Multiple users

## 1. Start MongoDB

Docker:

```bash
docker compose up -d
```

Or use an existing MongoDB instance.

## 2. Install

```bash
npm install
```

## 3. Environment

Copy:

```text
.env.example
```

to:

```text
.env
```

Example:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mini_gmail
JWT_SECRET=my-super-secret-key
JWT_EXPIRES_IN=1d
```

## 4. Seed demo data

```bash
node seed.js
```

Demo:

```text
prem@gmail.com
123456
```

## 5. Run

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## REST API

After login, the JWT is stored in an HTTP-only cookie.

```http
GET /api/mail/inbox
GET /api/mail/sent
GET /api/mail/:id
GET /api/stats

POST /api/mail/send
```

Pagination:

```http
GET /api/mail/inbox?page=2
```

Search:

```http
GET /api/mail/inbox?q=java
```

For external API clients, use:

```http
Authorization: Bearer <JWT>
```
