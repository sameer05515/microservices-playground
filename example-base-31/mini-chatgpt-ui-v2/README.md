# Mini ChatGPT UI V2

React + Vite frontend with Node/Express backend, OpenAI integration, Markdown rendering and syntax highlighting.

## Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
```

Set `OPENAI_API_KEY` in `backend/.env` for real AI responses. Without it, the backend runs in demo mode.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

Backend: http://localhost:8080

## Features

- ChatGPT-style sidebar
- Real backend API
- OpenAI Responses API integration
- Conversation context
- Markdown
- Code syntax highlighting
- Copy code button
- Responsive UI
- Demo mode without API key
