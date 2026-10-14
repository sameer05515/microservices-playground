# Q&A Markdown App - V13

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


## V13 — Active Recall + Spaced Repetition

Use the **🧠 Study** button to open a recall session. Study mode hides the answers initially so you can try to answer from memory before revealing them. After revealing, rate your recall with **Again**, **Hard**, **Good**, or **Easy**. The app schedules the next review based on the rating.

### Review behavior

- **Again:** schedules another attempt in 10 minutes and resets the repetition streak.
- **Hard:** schedules a short interval (1 day on the first review, then about 1.2× the prior interval).
- **Good:** schedules 1 day for the first successful review, 3 days for the second, then grows by the ease factor.
- **Easy:** schedules 3 days for the first review, 5 days for the second, then uses a longer interval than Good.
- Due questions appear before unseen questions. Questions not yet due are held for a later session.
- Study statistics show due, new, learning, and mastered (21+ day interval) counts.
- Review progress is stored in this browser's `localStorage` under `qa-review-progress-v1`; it is not stored in MongoDB and is not included in question-bank import/export. It stays on this browser/profile and can be lost if browser storage is cleared.
- Question content remains in MongoDB. Existing question and tag APIs are unchanged.

### Suggested workflow

1. Click **Study**.
2. Before revealing the answer, say or write your answer from memory.
3. Reveal the answer and compare it with your response.
4. Rate honestly: Again (couldn't recall), Hard (partial/slow), Good (correct with some effort), or Easy (quick and confident).
5. Return when questions become due.
