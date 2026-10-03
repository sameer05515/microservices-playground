# Question Bank — Node.js + EJS

A server-rendered technical question bank built with:

- Node.js
- Express
- EJS
- Markdown via `marked`
- Syntax highlighting via `highlight.js`
- JSON file persistence

## Data

The original `question-bank.json` is copied to:

```text
data/question-bank.json
```

The application reads this file at startup. The JSON structure is:

```json
{
  "version": 1,
  "exportedAt": "...",
  "tags": [],
  "questions": [
    {
      "id": "...",
      "question": "...",
      "answers": ["..."],
      "tags": []
    }
  ]
}
```

## Run

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

Development mode:

```bash
npm run dev
```

## Features

- Dashboard with question/tag statistics
- Full-text search across questions, answers and tags
- Tag filtering
- Paginated question list
- Individual question/answer page
- Markdown rendering
- Java/code syntax highlighting
- Copy-code buttons
- Previous/next navigation
- Random question
- Dark/light theme
- `/api/questions` endpoint exposing the original JSON data

## Routes

```text
GET /
GET /questions
GET /questions?q=redis
GET /questions?tag=<tag-id>
GET /questions/:id
GET /random
GET /api/questions
```

## Important

The application does not rewrite or normalize your question/answer content. Markdown is rendered at view time, so the original JSON remains the source of truth.
