# MemoMark v2

MemoMark is a Markdown knowledge manager for technical notes, interview preparation and reusable content.

## v2 Features

- Full CRUD
- JSON persistence
- UUID auto-generated IDs
- Markdown content
- Marked Markdown rendering
- Highlight.js code highlighting
- Live Markdown preview
- Search
- Tag support
- Tag filtering
- Duplicate note
- REST read APIs
- Responsive UI
- Sample Java/Spring Boot notes

## Run

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

Development:

```bash
npm run dev
```

## Routes

| Method | URL | Purpose |
|---|---|---|
| GET | `/` | List/search/filter |
| GET | `/notes/new` | Create form |
| POST | `/notes` | Create |
| GET | `/notes/:id` | Read |
| GET | `/notes/:id/edit` | Edit form |
| POST | `/notes/:id/update` | Update |
| POST | `/notes/:id/delete` | Delete |
| POST | `/notes/:id/duplicate` | Duplicate |
| GET | `/api/notes` | JSON API |
| GET | `/api/notes/:id` | JSON API |

## Data

Stored in:

```text
data/notes.json
```

Example:

```json
{
  "id": "uuid",
  "title": "Java HashMap",
  "tags": ["java", "collections"],
  "content": "# HashMap\n\nMarkdown...",
  "createdAt": "2026-10-05T00:00:00.000Z",
  "updatedAt": "2026-10-05T00:00:00.000Z"
}
```

## Project

```text
memomark-v2/
├── app.js
├── package.json
├── README.md
├── data/
│   └── notes.json
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── editor.js
└── views/
    ├── 404.ejs
    ├── form.ejs
    ├── index.ejs
    ├── show.ejs
    └── partials/
        ├── footer.ejs
        └── header.ejs
```
