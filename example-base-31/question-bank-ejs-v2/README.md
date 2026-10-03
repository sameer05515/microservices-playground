# Question Bank EJS v2

Node.js + Express + EJS application for the supplied `question-bank.json`.

## Features

- Search questions
- Filter by tags
- Markdown rendering + code highlighting
- Random question
- Question CRUD: create, read, update, delete
- Tag CRUD
- Import complete question-bank JSON with validation
- Export complete question-bank JSON
- REST CRUD API
- Atomic JSON file writes

## Run

```bash
npm install
npm start
```

Open http://localhost:3000

Management UI: http://localhost:3000/manage

## REST API

```http
GET    /api/questions
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

POST/PUT example:

```json
{
  "question": "What is Redis?",
  "answers": ["Redis is an in-memory data store."],
  "tags": ["6a9fd244443b416bda75278d"]
}
```

## Import format

Import expects the complete bank structure:

```json
{
  "version": 1,
  "tags": [{"id":"tag-id","name":"Java"}],
  "questions": [{
    "id":"question-id",
    "question":"What is Java?",
    "answers":["Answer in markdown"],
    "tags":["tag-id"]
  }]
}
```

The import is rejected if required fields are missing, IDs are duplicated, or a question references a non-existent tag.
