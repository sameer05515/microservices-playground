# Q&A Markdown App - V11

Node.js + Express + MongoDB question/answer application.

## MongoDB

Default connection:

```text
mongodb://localhost:27017/ques_ans_db
```

You can override it:

```powershell
$env:MONGODB_URI="mongodb://localhost:27017"
$env:MONGODB_DB="ques_ans_db"
```

The application uses these collections:

- `questions`
- `tags`

It does **not** use `data/questions.json` for CRUD persistence anymore.

## Run

```bash
npm install
npm start
```

Open http://localhost:3000

## APIs

### Questions

```text
GET    /api/questions
GET    /api/questions/:id
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### Tags

```text
GET    /api/tags
GET    /api/tags/:id
POST   /api/tags
PUT    /api/tags/:id
DELETE /api/tags/:id
```

### Import / Export

```text
GET  /api/export
POST /api/import
```

Import replaces the current MongoDB `questions` and `tags` collections.

## Notes

- Existing question IDs are preserved when already present in MongoDB.
- Answers support Markdown and multiple answers per question.
- Question updates only modify answers when `answersChanged: true` is sent by the UI.
- Deleting a tag removes that tag ID from questions.
