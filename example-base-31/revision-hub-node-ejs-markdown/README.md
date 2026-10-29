# Revision Hub — Node.js + Express + EJS

Single local app for topic management, question bank, and revision tracking.

## Features
- Create and delete topics with category and description.
- Add, edit, delete, search, and filter questions; save answers, difficulty, and tags.
- **Markdown answers:** headings, bold/italic, lists, links, tables, inline code, and fenced code blocks; rendered HTML is sanitized before display.
- Log a revision with time spent, recall rating, and notes.
- Suggested next review intervals: Again = 1 day, Hard = 2 days, Good = 4 days, Easy = 7 days.
- Dashboard with totals, today's revision time, and a due-review queue.
- JSON storage in `data/topics.json`, `data/questions.json`, and `data/revisions.json`.

## Run
Requires Node.js 18+.
```bash
npm install
npm start
```
Open http://localhost:3000

For development auto-restart: `npm run dev`.

This is a local single-user starter app. For production, use a database, authentication, input validation, CSRF protection, and safe concurrent writes.