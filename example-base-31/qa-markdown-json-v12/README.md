# Q&A Markdown App - V12

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

## V12 Markdown improvements

- Syntax highlighting for fenced code blocks using Highlight.js.
- GitHub Flavored Markdown enabled explicitly (`gfm: true`).
- Pipe tables, strikethrough, task lists, and autolinks.
- Responsive horizontally scrollable tables and code blocks.
- Highlight.js theme switches between GitHub Light and GitHub Dark with the app theme.

Example GFM table:

```markdown
| Collection | Thread-safe | Allows null |
|---|---|---|
| HashMap | No | Yes |
| Hashtable | Yes | No |
| ConcurrentHashMap | Yes | No |
```

Example highlighted code:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```
