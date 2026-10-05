# Markdown Q&A v3 JSON

Node.js + Express application for storing questions with multiple multiline Markdown answers in `data/questions.json`.

## Features
- Multiple answers per question
- Multiline Markdown answers
- Markdown rendering
- Search across question, tags and answers
- Create / edit / delete questions
- JSON file persistence
- No database required

## Run

```bash
npm install
npm start
```

Open http://localhost:3000

## Data format

```json
{
  "id": "q1",
  "question": "What is Java?",
  "tags": ["java", "basics"],
  "answers": [
    {
      "id": "a1",
      "title": "Short Answer",
      "markdown": "Java is **...**"
    }
  ]
}
```


## v3
- Light/Dark theme toggle
- Theme preference saved in localStorage
- Uses system theme on first visit
