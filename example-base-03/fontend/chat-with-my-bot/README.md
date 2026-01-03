# chat-with-my-bot

Small **Express + MongoDB** playground app with a simple **EJS** chat UI. User questions are processed with **node-nlp** (intent + country entity), answers are generated (e.g. country capitals), and each Q&A pair is stored as a **Conversation** document.

Part of the `microservices-playground` / `example-base-03` frontend examples.

---

## Features

- Web UI at `/` — textarea + “Send Question”; calls the API and shows question/answer.
- **POST `/answer`** — runs NLP on `questionText`, persists `{ questionText, answerText }`, returns JSON including `_id` and `uniqueId`.
- **Intents** (English): `getCapital` (capital of a country) and `getCountry` (acknowledge country mention).
- **Countries** in the model: USA, United Kingdom, France, Germany, India, Pakistan (synonyms like `usa`, `uk`, `america`, …).

---

## Prerequisites

- **Node.js** (LTS recommended)
- **MongoDB** running locally (or a reachable URI)

---

## Setup

```bash
cd example-base-03/fontend/chat-with-my-bot
npm install
```

### Environment variables

| Variable       | Default | Description        |
|----------------|---------|--------------------|
| `MONGODB_URI`  | `mongodb://127.0.0.1:27017/ms_playground_ex03_conversation_db` | MongoDB connection string |
| `PORT`         | `5005`  | HTTP port           |

Example:

```bash
set MONGODB_URI=mongodb://127.0.0.1:27017/ms_playground_ex03_conversation_db
set PORT=5005
npm start
```

Or with **nodemon** for development:

```bash
npm run dev
```

Open **http://localhost:5005** (or your `PORT`).

---

## API

### `POST /answer`

**Request** — JSON body:

```json
{ "questionText": "What is the capital of France?" }
```

**Response** — `200` JSON:

```json
{
  "questionText": "...",
  "answerText": "...",
  "_id": "...",
  "uniqueId": "..."
}
```

**Errors** — JSON body when possible:

- **`400`** — `{ "error": "questionText is required and must be a non-empty string" }`
- **`500`** — `{ "error": "Failed to process question" }`

---

## Project structure

```
chat-with-my-bot/
├── package.json
├── model.nlp                 # optional / legacy NLP artifact (training uses in-code documents)
├── public/
│   └── countries.json        # static data (not wired in current NLP flow)
└── src/
    ├── app.js                # Express app, routes, Mongo connect
    ├── views/
    │   └── chat.ejs          # Chat page + fetch to /answer
    └── conversation/
        ├── conversation.model.js   # Mongoose schema (uniqueId, questionText, answerText, …)
        ├── conversation.service.js # CRUD helpers
        ├── conversation.lps.js     # node-nlp manager, training, doNaturalLP
        └── conversation.util.js    # e.g. capitalizedText helper
```

---

## How it works

1. **Training** — On load, `nlpManager.train()` runs and its promise is stored; **`doNaturalLP` awaits it** so the first request does not run before the model is ready (otherwise you can get intent `None`).
2. **Inference** — Lowercases input, runs `nlpManager.process`. **Named entities from `addNamedEntityText` often come back empty** in this stack, so a **phrase-based fallback** (`extractCountryFromUtterance`) detects known countries in the text. If the classifier still returns `None` but a country was found, intent is inferred from keywords (e.g. `capital` → `getCapital`). Capitals are resolved via `CAPITAL_BY_COUNTRY`.
3. **Persistence** — `conversation.service.createConversation` saves the document; `uniqueId` defaults to a UUID from the schema.

---

## Scripts

| Script    | Command              |
|-----------|----------------------|
| `start`   | `node src/app.js`    |
| `dev`     | `nodemon src/app.js` |

---

## Possible improvements

- **`public/countries.json`** — Not used yet; you could load it (or another source) to drive `getCapitalOfCountry` instead of the in-code `CAPITAL_BY_COUNTRY` map.

---

## License

ISC (see `package.json`).
