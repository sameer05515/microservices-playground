const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { marked } = require("marked");
const hljs = require("highlight.js");

const app = express();
const PORT = process.env.PORT || 3002;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");

fs.mkdirSync(DATA_DIR, { recursive: true });

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

marked.setOptions({
  gfm: true,
  breaks: true,
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

app.locals.markdown = (content = "") => marked.parse(content);

app.locals.preview = (content = "") => {
  const html = marked.parse(content);
  return html.length > 700 ? html.substring(0, 700) + "..." : html;
};

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeNotes(notes) {
  const temp = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(notes, null, 2), "utf8");
  fs.renameSync(temp, DATA_FILE);
}

function generateId() {
  return crypto.randomUUID();
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return [...new Set(
      value.map(v => String(v).trim().toLowerCase()).filter(Boolean)
    )];
  }

  return [...new Set(
    String(value || "")
      .split(",")
      .map(v => v.trim().toLowerCase())
      .filter(Boolean)
  )];
}

function findNote(id) {
  return readNotes().find(note => note.id === id);
}

// LIST + SEARCH + TAG FILTER
app.get("/", (req, res) => {
  const notes = readNotes();
  const q = (req.query.q || "").trim().toLowerCase();
  const tag = (req.query.tag || "").trim().toLowerCase();

  const filtered = notes.filter(note => {
    const matchesQuery =
      !q ||
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.tags.some(t => t.includes(q));

    const matchesTag =
      !tag || note.tags.includes(tag);

    return matchesQuery && matchesTag;
  });

  const allTags = [...new Set(notes.flatMap(note => note.tags))].sort();

  res.render("index", {
    pageTitle: "MemoMark",
    notes: filtered,
    allTags,
    q: req.query.q || "",
    tag
  });
});

// CREATE FORM
app.get("/notes/new", (req, res) => {
  res.render("form", {
    pageTitle: "New Note",
    mode: "create",
    error: null,
    note: {
      title: "",
      tags: [],
      content: ""
    }
  });
});

// CREATE
app.post("/notes", (req, res) => {
  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "");
  const tags = normalizeTags(req.body.tags);

  if (!title) {
    return res.status(400).render("form", {
      pageTitle: "New Note",
      mode: "create",
      error: "Title is required.",
      note: { title, tags, content }
    });
  }

  const now = new Date().toISOString();

  const note = {
    id: generateId(),
    title,
    tags,
    content,
    createdAt: now,
    updatedAt: now
  };

  const notes = readNotes();
  notes.unshift(note);
  writeNotes(notes);

  res.redirect(`/notes/${note.id}`);
});

// READ
app.get("/notes/:id", (req, res) => {
  const note = findNote(req.params.id);

  if (!note) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  res.render("show", {
    pageTitle: note.title,
    note
  });
});

// EDIT FORM
app.get("/notes/:id/edit", (req, res) => {
  const note = findNote(req.params.id);

  if (!note) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  res.render("form", {
    pageTitle: "Edit Note",
    mode: "edit",
    error: null,
    note
  });
});

// UPDATE
app.post("/notes/:id/update", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(note => note.id === req.params.id);

  if (index === -1) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  const title = String(req.body.title || "").trim();
  const content = String(req.body.content || "");
  const tags = normalizeTags(req.body.tags);

  if (!title) {
    return res.status(400).render("form", {
      pageTitle: "Edit Note",
      mode: "edit",
      error: "Title is required.",
      note: { ...notes[index], title, tags, content }
    });
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    content,
    updatedAt: new Date().toISOString()
  };

  writeNotes(notes);

  res.redirect(`/notes/${req.params.id}`);
});

// DELETE
app.post("/notes/:id/delete", (req, res) => {
  const notes = readNotes();
  const filtered = notes.filter(note => note.id !== req.params.id);

  if (filtered.length === notes.length) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  writeNotes(filtered);
  res.redirect("/");
});

// DUPLICATE
app.post("/notes/:id/duplicate", (req, res) => {
  const note = findNote(req.params.id);

  if (!note) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  const now = new Date().toISOString();

  const copy = {
    ...note,
    id: generateId(),
    title: `${note.title} (Copy)`,
    createdAt: now,
    updatedAt: now
  };

  const notes = readNotes();
  notes.unshift(copy);
  writeNotes(notes);

  res.redirect(`/notes/${copy.id}/edit`);
});

// API: GET ALL
app.get("/api/notes", (req, res) => {
  res.json(readNotes());
});

// API: GET ONE
app.get("/api/notes/:id", (req, res) => {
  const note = findNote(req.params.id);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
});

app.listen(PORT, () => {
  console.log(`MemoMark v2 running at http://localhost:${PORT}`);
});
