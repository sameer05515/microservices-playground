# Markdown Q&A JSON App — V5

Node.js + Express + Tailwind CSS Q&A application.

## Features
- 409 imported questions from the question bank
- Multiple multiline Markdown answers
- Search questions, answers and tags
- JSON file persistence
- Question CRUD
- **Tag CRUD:** Create, retrieve/list, retrieve by ID, update and delete
- Deleted tags are automatically detached from questions
- Select existing tags while creating/editing questions
- Light/Dark theme toggle with localStorage persistence
- Responsive Tailwind CSS UI

## Run
```bash
npm install
npm start
```
Open http://localhost:3000

## Tag API
- `GET /api/tags`
- `GET /api/tags/:id`
- `POST /api/tags` body `{ "name": "Java" }`
- `PUT /api/tags/:id` body `{ "name": "Java 8" }`
- `DELETE /api/tags/:id`
