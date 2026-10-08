const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { marked } = require("marked");
const hljs = require("highlight.js");

const app = express();
const PORT = process.env.PORT || 7009;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "notes.json");
const BOOKMARK_FILE = path.join(DATA_DIR, "bookmark.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

if (!fs.existsSync(BOOKMARK_FILE)) {
  fs.writeFileSync(BOOKMARK_FILE, "[]", "utf8");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.locals.markedPreview = (content = "") => {
  const html = marked.parse(content);
  return html.length > 900 ? html.substring(0, 900) + "..." : html;
};

app.locals.preview = (content = "") => {
    const html = marked.parse(content);

    return html.length > 700
        ? html.substring(0, 700) + "..."
        : html;
};

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

function readNotes() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (error) {
    console.error("Failed to read data:", error);
    return [];
  }
}

function writeNotes(notes) {
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(notes, null, 2), "utf8");
  fs.renameSync(tempFile, DATA_FILE);
}

function readBookmarks() {
  try { return JSON.parse(fs.readFileSync(BOOKMARK_FILE, "utf8")); }
  catch { return []; }
}

function writeBookmarks(bookmarks) {
  const temp = `${BOOKMARK_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(bookmarks, null, 2), "utf8");
  fs.renameSync(temp, BOOKMARK_FILE);
}

function isBookmarked(noteId) {
  return readBookmarks().includes(noteId);
}

function findNote(id) {
  return readNotes().find(note => note.id === id);
}

function generateId() {
  return crypto.randomUUID();
}

function renderMarkdown(content = "") {
  return marked.parse(content);
}

// LIST
app.get("/", (req, res) => {
  const notes = readNotes();

  res.render("index", {
    notes,
    pageTitle: "MemoMark",
    bookmarks: readBookmarks()
  });
});

// CREATE FORM
app.get("/notes/new", (req, res) => {
  res.render("form", {
    pageTitle: "New Note",
    mode: "create",
    note: {
      title: "",
      content: ""
    }
  });
});

// CREATE
app.post("/notes", (req, res) => {
  const title = (req.body.title || "").trim();
  const content = req.body.content || "";

  if (!title) {
    return res.status(400).render("form", {
      pageTitle: "New Note",
      mode: "create",
      error: "Title is required.",
      note: { title, content }
    });
  }

  const notes = readNotes();

  notes.unshift({
    id: generateId(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  writeNotes(notes);
  res.redirect("/");
});

// READ + CLOSED-LOOP PREV/NEXT
app.get("/notes/:id", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(note => note.id === req.params.id);

  if (index === -1) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  const note = notes[index];
  const previousNote = notes[(index - 1 + notes.length) % notes.length];
  const nextNote = notes[(index + 1) % notes.length];

  res.render("show", {
    pageTitle: note.title,
    note,
    previousNote,
    nextNote,
    bookmarked: isBookmarked(note.id),
    renderedContent: renderMarkdown(note.content)
  });
});

// BOOKMARK TOGGLE
app.post("/notes/:id/bookmark", (req, res) => {
  const note = findNote(req.params.id);
  if (!note) return res.status(404).render("404", { pageTitle: "Not Found" });

  const bookmarks = readBookmarks();
  const i = bookmarks.indexOf(note.id);
  if (i === -1) bookmarks.push(note.id); else bookmarks.splice(i, 1);
  writeBookmarks(bookmarks);
  res.redirect(req.get("referer") || `/notes/${note.id}`);
});

// BOOKMARK LIST
app.get("/bookmarks", (req, res) => {
  const notes = readNotes();
  const bookmarks = readBookmarks();
  const bookmarkedNotes = bookmarks.map(id => notes.find(n => n.id === id)).filter(Boolean);
  res.render("bookmarks", { pageTitle: "Bookmarks", notes: bookmarkedNotes, bookmarks });
});

// EDIT FORM
app.get("/notes/:id/edit", (req, res) => {
  const notes = readNotes();
  const note = notes.find(item => item.id === req.params.id);

  if (!note) {
    return res.status(404).render("404", {
      pageTitle: "Note Not Found"
    });
  }

  res.render("form", {
    pageTitle: "Edit Note",
    mode: "edit",
    note
  });
});

// UPDATE
app.post("/notes/:id/update", (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(item => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).render("404", {
      pageTitle: "Note Not Found"
    });
  }

  const title = (req.body.title || "").trim();
  const content = req.body.content || "";

  if (!title) {
    return res.status(400).render("form", {
      pageTitle: "Edit Note",
      mode: "edit",
      error: "Title is required.",
      note: {
        ...notes[index],
        title,
        content
      }
    });
  }

  notes[index] = {
    ...notes[index],
    title,
    content,
    updatedAt: new Date().toISOString()
  };

  writeNotes(notes);
  res.redirect(`/notes/${req.params.id}`);
});

// DELETE
app.post("/notes/:id/delete", (req, res) => {
  const notes = readNotes();
  const filtered = notes.filter(item => item.id !== req.params.id);

  if (filtered.length === notes.length) {
    return res.status(404).render("404", {
      pageTitle: "Note Not Found"
    });
  }

  writeNotes(filtered);
  writeBookmarks(readBookmarks().filter(id => id !== req.params.id));
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`MemoMark running at http://localhost:${PORT}`);
});

app.get("/api/bookmarks", (req, res) => {
  const notes = readNotes();
  res.json(readBookmarks().map(id => notes.find(n => n.id === id)).filter(Boolean));
});
