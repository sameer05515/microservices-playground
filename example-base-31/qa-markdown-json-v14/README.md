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
- `reviewProgress` (Active Recall / Spaced Repetition schedule and review history)

It does **not** use `data/questions.json` for CRUD persistence anymore.

## Run

```bash
npm install
npm start
```

Open http://localhost:3009

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
- Review progress is stored in MongoDB's `reviewProgress` collection and is shared across browsers accessing this app/database. It is not included in question-bank import/export.
- On first launch after upgrading from V13, the app attempts a one-time migration of valid review progress from this browser's `qa-review-progress-v1` localStorage key into MongoDB, then removes that legacy key after successful migration.
- Question content remains in MongoDB. Existing question and tag APIs are unchanged.
- This version has no authentication, so review progress is shared by all people using the same deployment/database. Add user authentication and a user ID in the review record if progress must be separate per person.

### Suggested workflow

1. Click **Study**.
2. Before revealing the answer, say or write your answer from memory.
3. Reveal the answer and compare it with your response.
4. Rate honestly: Again (couldn't recall), Hard (partial/slow), Good (correct with some effort), or Easy (quick and confident).
5. Return when questions become due.


### Review progress APIs

```text
GET  /api/reviews                 # all review progress keyed by question ID
PUT  /api/reviews/:questionId     # save/update one question's schedule
```

The `reviewProgress` collection uses a unique index on `questionId`. Deleting a question also deletes its review record. Importing a question bank removes review records for question IDs that no longer exist.
