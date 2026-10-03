const express = require("express");
const path = require("path");
const fs = require("fs");
const { marked } = require("marked");
const hljs = require("highlight.js");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "question-bank.json");

const bank = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const tagMap = new Map(bank.tags.map(t => [t.id, t.name]));

marked.setOptions({
  gfm: true,
  breaks: true,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang || "") ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  }
});

function decorateQuestion(q, index) {
  return {
    ...q,
    index,
    number: index + 1,
    tagNames: (q.tags || []).map(id => tagMap.get(id)).filter(Boolean),
    answerHtml: (q.answers || []).map(markdown => marked.parse(markdown))
  };
}

const questions = bank.questions.map(decorateQuestion);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.locals.marked = marked;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    bank,
    questions,
    activeTag: "",
    query: "",
    page: 1,
    totalPages: 1,
    totalFiltered: questions.length
  });
});

app.get("/questions", (req, res) => {
  const query = String(req.query.q || "").trim();
  const activeTag = String(req.query.tag || "").trim();
  const pageSize = Math.min(Math.max(Number(req.query.size) || 12, 6), 50);

  let filtered = questions;

  if (query) {
    const needle = query.toLowerCase();
    filtered = filtered.filter(q => {
      const haystack = [
        q.question,
        ...(q.answers || []),
        ...q.tagNames
      ].join("\n").toLowerCase();
      return haystack.includes(needle);
    });
  }

  if (activeTag) {
    filtered = filtered.filter(q => q.tags?.includes(activeTag));
  }

  const requestedPage = Math.max(Number(req.query.page) || 1, 1);
  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;
  const pageQuestions = filtered.slice(start, start + pageSize);

  res.render("questions", {
    bank,
    questions: pageQuestions,
    allQuestions: questions,
    activeTag,
    query,
    page,
    totalPages,
    totalFiltered: filtered.length,
    pageSize,
    start
  });
});

app.get("/questions/:id", (req, res) => {
  const index = questions.findIndex(q => q.id === req.params.id);
  if (index === -1) return res.status(404).render("404", { bank });

  const question = questions[index];
  res.render("question", {
    bank,
    question,
    previous: questions[index - 1] || null,
    next: questions[index + 1] || null
  });
});

app.get("/random", (req, res) => {
  const question = questions[Math.floor(Math.random() * questions.length)];
  res.redirect(`/questions/${question.id}`);
});

app.get("/api/questions", (req, res) => {
  res.json(bank);
});

app.listen(PORT, () => {
  console.log(`Question Bank running at http://localhost:${PORT}`);
  console.log(`Loaded ${questions.length} questions and ${bank.tags.length} tags.`);
});