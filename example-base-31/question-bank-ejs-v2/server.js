const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { marked } = require("marked");
const hljs = require("highlight.js");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "question-bank.json");

marked.setOptions({ gfm: true, breaks: true });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

function loadBank() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function saveBank(bank) {
  const temp = DATA_FILE + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(bank, null, 2) + "\n", "utf8");
  fs.renameSync(temp, DATA_FILE);
}

function id() {
  return crypto.randomBytes(12).toString("hex");
}

function tagMap(bank) {
  return new Map((bank.tags || []).map(t => [t.id, t.name]));
}

function decorateQuestion(q, index, bank) {
  const map = tagMap(bank);
  return {
    ...q,
    index,
    number: index + 1,
    tagNames: (q.tags || []).map(x => map.get(x)).filter(Boolean),
    answerHtml: (q.answers || []).map(markdown => marked.parse(markdown))
  };
}

function getQuestions(bank) {
  return bank.questions.map((q, i) => decorateQuestion(q, i, bank));
}

function validateBank(candidate) {
  if (!candidate || typeof candidate !== "object") throw new Error("JSON root must be an object.");
  if (!Array.isArray(candidate.tags)) throw new Error("tags must be an array.");
  if (!Array.isArray(candidate.questions)) throw new Error("questions must be an array.");
  const tagIds = new Set();
  for (const tag of candidate.tags) {
    if (!tag.id || !tag.name) throw new Error("Every tag requires id and name.");
    if (tagIds.has(tag.id)) throw new Error(`Duplicate tag id: ${tag.id}`);
    tagIds.add(tag.id);
  }
  const questionIds = new Set();
  for (const q of candidate.questions) {
    if (!q.id || typeof q.question !== "string") throw new Error("Every question requires id and question.");
    if (!Array.isArray(q.answers)) throw new Error(`Answers must be an array for question ${q.id}.`);
    if (!Array.isArray(q.tags)) throw new Error(`Tags must be an array for question ${q.id}.`);
    if (questionIds.has(q.id)) throw new Error(`Duplicate question id: ${q.id}`);
    questionIds.add(q.id);
    for (const tagId of q.tags) {
      if (!tagIds.has(tagId)) throw new Error(`Unknown tag ${tagId} in question ${q.id}.`);
    }
  }
  return true;
}

function normalizeQuestion(body, existingId) {
  let answers = body.answers;
  if (typeof answers === "string") answers = answers.split(/\n\s*---\s*\n/g);
  if (!Array.isArray(answers)) answers = [];
  const tags = Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []);
  return {
    id: existingId || id(),
    question: String(body.question || "").trim(),
    answers: answers.map(String).filter(x => x.trim()),
    tags: [...new Set(tags.map(String).filter(Boolean))]
  };
}

function normalizeTag(body, existingId) {
  return { id: existingId || id(), name: String(body.name || "").trim() };
}

function renderManage(res, options = {}) {
  const bank = loadBank();
  const questions = getQuestions(bank);
  res.render("manage", { bank, questions, ...options });
}

app.get("/", (req, res) => {
  const bank = loadBank();
  const questions = getQuestions(bank);
  res.render("index", { bank, questions, activeTag: "", query: "", page: 1, totalPages: 1, totalFiltered: questions.length });
});

app.get("/questions", (req, res) => {
  const bank = loadBank();
  const all = getQuestions(bank);
  const query = String(req.query.q || "").trim();
  const activeTag = String(req.query.tag || "").trim();
  const pageSize = Math.min(Math.max(Number(req.query.size) || 12, 6), 50);
  let filtered = all;
  if (query) {
    const needle = query.toLowerCase();
    filtered = filtered.filter(q => [q.question, ...(q.answers || []), ...q.tagNames].join("\n").toLowerCase().includes(needle));
  }
  if (activeTag) filtered = filtered.filter(q => q.tags?.includes(activeTag));
  const requestedPage = Math.max(Number(req.query.page) || 1, 1);
  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;
  res.render("questions", { bank, questions: filtered.slice(start, start + pageSize), allQuestions: all, activeTag, query, page, totalPages, totalFiltered: filtered.length, pageSize, start });
});

app.get("/questions/:id", (req, res) => {
  const bank = loadBank();
  const questions = getQuestions(bank);
  const index = questions.findIndex(q => q.id === req.params.id);
  if (index === -1) return res.status(404).render("404", { bank });
  res.render("question", { bank, question: questions[index], previous: questions[index - 1] || null, next: questions[index + 1] || null });
});

app.get("/random", (req, res) => {
  const bank = loadBank();
  if (!bank.questions.length) return res.redirect("/questions");
  res.redirect(`/questions/${bank.questions[Math.floor(Math.random() * bank.questions.length)].id}`);
});

// ---------------- CRUD UI ----------------
app.get("/manage", (req, res) => renderManage(res, { message: req.query.message || "", error: req.query.error || "" }));

app.get("/manage/questions/new", (req, res) => renderManage(res, { editQuestion: null, formError: "" }));

app.get("/manage/questions/:id/edit", (req, res) => {
  const bank = loadBank();
  const question = bank.questions.find(q => q.id === req.params.id);
  if (!question) return res.status(404).render("404", { bank });
  renderManage(res, { editQuestion: question, formError: "" });
});

app.post("/manage/questions/save", (req, res) => {
  try {
    const bank = loadBank();
    const q = normalizeQuestion(req.body, req.body.id || undefined);
    if (!q.question) throw new Error("Question text is required.");
    if (!q.answers.length) throw new Error("At least one answer is required.");
    const unknown = q.tags.filter(t => !bank.tags.some(x => x.id === t));
    if (unknown.length) throw new Error("One or more selected tags no longer exist.");
    const index = bank.questions.findIndex(x => x.id === q.id);
    if (index >= 0) bank.questions[index] = q; else bank.questions.unshift(q);
    validateBank(bank);
    saveBank(bank);
    res.redirect(`/manage?message=${encodeURIComponent(index >= 0 ? "Question updated." : "Question created.")}`);
  } catch (e) {
    const bank = loadBank();
    res.status(400).render("manage", { bank, questions: getQuestions(bank), editQuestion: req.body, formError: e.message, message: "", error: "" });
  }
});

app.post("/manage/questions/:id/delete", (req, res) => {
  const bank = loadBank();
  const before = bank.questions.length;
  bank.questions = bank.questions.filter(q => q.id !== req.params.id);
  if (bank.questions.length !== before) saveBank(bank);
  res.redirect(`/manage?message=${encodeURIComponent(before === bank.questions.length ? "Question not found." : "Question deleted.")}`);
});

// Tag CRUD
app.post("/manage/tags/save", (req, res) => {
  try {
    const bank = loadBank();
    const tag = normalizeTag(req.body, req.body.id || undefined);
    if (!tag.name) throw new Error("Tag name is required.");
    if (bank.tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase() && t.id !== tag.id)) throw new Error("A tag with this name already exists.");
    const index = bank.tags.findIndex(t => t.id === tag.id);
    if (index >= 0) bank.tags[index] = tag; else bank.tags.push(tag);
    saveBank(bank);
    res.redirect(`/manage?message=${encodeURIComponent(index >= 0 ? "Tag updated." : "Tag created.")}`);
  } catch (e) {
    res.redirect(`/manage?error=${encodeURIComponent(e.message)}`);
  }
});

app.post("/manage/tags/:id/delete", (req, res) => {
  const bank = loadBank();
  const used = bank.questions.some(q => (q.tags || []).includes(req.params.id));
  if (used) return res.redirect(`/manage?error=${encodeURIComponent("Cannot delete a tag that is used by a question.")}`);
  bank.tags = bank.tags.filter(t => t.id !== req.params.id);
  saveBank(bank);
  res.redirect(`/manage?message=${encodeURIComponent("Tag deleted.")}`);
});

// ---------------- Import / Export ----------------
app.get("/export", (req, res) => {
  const bank = loadBank();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="question-bank-${new Date().toISOString().slice(0,10)}.json"`);
  res.send(JSON.stringify({ ...bank, exportedAt: new Date().toISOString() }, null, 2));
});

app.post("/import", (req, res) => {
  try {
    let candidate = req.body;
    if (typeof candidate.data === "string") candidate = JSON.parse(candidate.data);
    validateBank(candidate);
    candidate.version = Number(candidate.version) || 1;
    candidate.exportedAt = new Date().toISOString();
    saveBank(candidate);
    res.json({ success: true, questions: candidate.questions.length, tags: candidate.tags.length });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// ---------------- REST API CRUD ----------------
app.get("/api/questions", (req, res) => res.json(loadBank()));

app.post("/api/questions", (req, res) => {
  try {
    const bank = loadBank();
    const q = normalizeQuestion(req.body);
    if (!q.question || !q.answers.length) return res.status(400).json({ error: "question and at least one answer are required" });
    validateBank({ ...bank, questions: [...bank.questions, q] });
    bank.questions.push(q); saveBank(bank);
    res.status(201).json(q);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.put("/api/questions/:id", (req, res) => {
  try {
    const bank = loadBank();
    const index = bank.questions.findIndex(q => q.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: "Question not found" });
    const q = normalizeQuestion(req.body, req.params.id);
    if (!q.question || !q.answers.length) return res.status(400).json({ error: "question and at least one answer are required" });
    bank.questions[index] = q; validateBank(bank); saveBank(bank); res.json(q);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.delete("/api/questions/:id", (req, res) => {
  const bank = loadBank();
  const old = bank.questions.length;
  bank.questions = bank.questions.filter(q => q.id !== req.params.id);
  if (old === bank.questions.length) return res.status(404).json({ error: "Question not found" });
  saveBank(bank); res.status(204).end();
});

app.listen(PORT, () => console.log(`Question Bank v2 running at http://localhost:${PORT}`));
