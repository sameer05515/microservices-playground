# Mini ChatGPT UI V2.1

## Fix included

The frontend contains no `async` `useEffect` callback.

Correct pattern:

```jsx
useEffect(() => {
  const checkBackend = async () => {
    // async work
  };

  checkBackend();

  return () => {
    // cleanup
  };
}, []);
```

## Run backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
npm run dev
```

Backend:

```text
http://localhost:8080
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Features

- React 19 + Vite
- Node.js + Express
- OpenAI Responses API
- Backend health indicator
- Markdown rendering
- Syntax highlighting
- Copy code button
- Conversation context
- Demo mode without API key
- Responsive UI
- New Chat
- Enter to send
- Shift + Enter for newline
