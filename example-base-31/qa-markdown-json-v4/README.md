# Markdown Q&A V4

Node.js + Express question/answer application.

## V4 Features
- Tailwind CSS UI
- Light / Dark theme toggle
- Theme persisted in localStorage
- System theme detection on first visit
- Multiple answers per question
- Multiline Markdown answers
- Markdown rendering
- Search questions, answers and tags
- Create / Edit / Delete questions
- JSON persistence in `data/questions.json`
- Supports imported export JSON containing `questions[]`

## Run
```bash
npm install
npm start
```

Open http://localhost:3000

> Tailwind CSS is loaded from the Tailwind CDN, so no Tailwind build step is required.
