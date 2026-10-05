# Questions MongoDB Importer

Imports `questions.json` into MongoDB.

## Project structure

```text
questions-mongodb-importer/
├── questions.json
├── import-questions.js
└── package.json
```

## Requirements

- Node.js 18+
- MongoDB running on localhost:27017

## Install

```bash
npm install
```

## Run

```bash
npm run import
```

## Default MongoDB configuration

```text
MongoDB : mongodb://localhost:27017
Database: ques_ans_db
```

## Custom MongoDB configuration

Windows PowerShell:

```powershell
$env:MONGO_URI="mongodb://localhost:27017"
$env:DB_NAME="ques_ans_db"
npm run import
```

## Collections

The importer creates/updates:

```text
ques_ans_db
├── tags
└── questions
```

## Important

The IDs already present in `questions.json` are preserved.

The importer uses MongoDB upsert, so running the script multiple times does not create duplicate questions or tags.

Answers are read from:

```javascript
question.answers[]
```

and Markdown is stored in:

```javascript
answers[].markdown
```

Tag references are stored in:

```javascript
questions[].tagIds
```
