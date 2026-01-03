import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3401;
const DATA_FILE =
  process.env.TODO_FILE || path.join(__dirname, "todo.json");

async function readStore() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.todos)) {
      return { todos: [] };
    }
    return parsed;
  } catch (e) {
    if (e.code === "ENOENT") {
      return { todos: [] };
    }
    throw e;
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/todos", async (_req, res, next) => {
  try {
    const store = await readStore();
    res.json(store.todos);
  } catch (err) {
    next(err);
  }
});

app.post("/api/todos", async (req, res, next) => {
  try {
    const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      res.status(400).json({ error: "title is required" });
      return;
    }
    const store = await readStore();
    const todo = {
      id: crypto.randomUUID(),
      title,
      done: Boolean(req.body?.done),
    };
    store.todos.push(todo);
    await writeStore(store);
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

app.patch("/api/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await readStore();
    const idx = store.todos.findIndex((t) => t.id === id);
    if (idx === -1) {
      res.status(404).json({ error: "not found" });
      return;
    }
    const cur = store.todos[idx];
    if (typeof req.body?.title === "string") {
      const title = req.body.title.trim();
      if (!title) {
        res.status(400).json({ error: "title cannot be empty" });
        return;
      }
      cur.title = title;
    }
    if (typeof req.body?.done === "boolean") {
      cur.done = req.body.done;
    }
    await writeStore(store);
    res.json(cur);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/todos/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const store = await readStore();
    const before = store.todos.length;
    store.todos = store.todos.filter((t) => t.id !== id);
    if (store.todos.length === before) {
      res.status(404).json({ error: "not found" });
      return;
    }
    await writeStore(store);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`todo backend listening on ${PORT}`);
});
