const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const TOPICS_FILE = path.join(DATA_DIR, 'topics.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function ensureData() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(TOPICS_FILE)) {
    fs.writeFileSync(TOPICS_FILE, JSON.stringify([
      { id: 'java-collections', title: 'Java Collections', category: 'Java', notes: 'List vs Set vs Map; HashMap internals' },
      { id: 'spring-di', title: 'Spring Dependency Injection', category: 'Spring Boot', notes: 'IoC, DI, constructor injection, bean scopes' },
      { id: 'react-hooks', title: 'React Hooks', category: 'React', notes: 'useState, useEffect, dependency array' }
    ], null, 2));
  }
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
}
function readJson(file, fallback = []) {
  ensureData();
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { console.error(`Unable to read ${path.basename(file)}`, e); return fallback; }
}
function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
function id() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

app.get('/', (req, res) => {
  const topics = readJson(TOPICS_FILE);
  const sessions = readJson(SESSIONS_FILE);
  const today = new Date().toLocaleDateString('en-CA');
  const todaySessions = sessions.filter(s => s.date === today);
  res.render('index', {
    topics,
    sessionsToday: todaySessions.length,
    minutesToday: todaySessions.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0),
    today: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
  });
});

app.post('/topics', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.redirect('/');
  const topics = readJson(TOPICS_FILE);
  topics.push({ id: id(), title: title.slice(0, 120), category: (req.body.category || 'General').trim().slice(0, 60), notes: (req.body.notes || '').trim().slice(0, 300) });
  writeJson(TOPICS_FILE, topics);
  res.redirect('/');
});

app.post('/topics/:id/delete', (req, res) => {
  writeJson(TOPICS_FILE, readJson(TOPICS_FILE).filter(t => t.id !== req.params.id));
  res.redirect('/');
});

app.post('/api/sessions', (req, res) => {
  const minutes = Math.max(1, Math.min(180, Number.parseInt(req.body.minutes, 10) || 25));
  const topicId = String(req.body.topicId || '');
  const topic = readJson(TOPICS_FILE).find(t => t.id === topicId);
  const sessions = readJson(SESSIONS_FILE);
  const now = new Date();
  sessions.push({
    id: id(), topicId: topic ? topic.id : null,
    topic: topic ? topic.title : 'General revision',
    minutes, completedAt: now.toISOString(),
    date: now.toLocaleDateString('en-CA')
  });
  writeJson(SESSIONS_FILE, sessions);
  res.json({ ok: true, sessionsToday: sessions.filter(s => s.date === now.toLocaleDateString('en-CA')).length });
});

app.get('/api/stats', (req, res) => {
  const sessions = readJson(SESSIONS_FILE);
  const today = new Date().toLocaleDateString('en-CA');
  const todays = sessions.filter(s => s.date === today);
  res.json({
    sessionsToday: todays.length,
    minutesToday: todays.reduce((sum, s) => sum + (Number(s.minutes) || 0), 0),
    totalSessions: sessions.length
  });
});

app.listen(PORT, () => {
  ensureData();
  console.log(`Pomodoro Revision is running at http://localhost:${PORT}`);
});
