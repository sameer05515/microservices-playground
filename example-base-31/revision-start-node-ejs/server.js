const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const TOPICS_FILE = path.join(DATA_DIR, 'topics.json');
const LOG_FILE = path.join(DATA_DIR, 'sessions.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return fallback; }
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function ensureFiles() {
  if (!fs.existsSync(TOPICS_FILE)) writeJson(TOPICS_FILE, [
    { id: 'java-core', name: 'Core Java', category: 'Java', nextStep: 'Revise HashMap vs ConcurrentHashMap', minutes: 10, done: false },
    { id: 'spring', name: 'Spring Boot', category: 'Spring', nextStep: 'Recall bean scopes without notes', minutes: 10, done: false },
    { id: 'system-design', name: 'System Design', category: 'Design', nextStep: 'Draw API Gateway + load balancer flow', minutes: 10, done: false }
  ]);
  if (!fs.existsSync(LOG_FILE)) writeJson(LOG_FILE, []);
}
ensureFiles();

app.get('/', (req, res) => {
  const topics = readJson(TOPICS_FILE, []);
  const sessions = readJson(LOG_FILE, []);
  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(s => s.date === today);
  res.render('index', {
    topics,
    todaySessions,
    todayMinutes: todaySessions.reduce((sum, s) => sum + Number(s.minutes || 0), 0),
    totalSessions: sessions.length,
    message: req.query.message || ''
  });
});

app.post('/topics', (req, res) => {
  const name = (req.body.name || '').trim();
  const category = (req.body.category || 'General').trim().slice(0, 40);
  const nextStep = (req.body.nextStep || '').trim().slice(0, 180);
  const minutes = Math.max(5, Math.min(60, Number(req.body.minutes) || 10));
  if (!name) return res.redirect('/?message=' + encodeURIComponent('Topic ka naam likho.'));
  const topics = readJson(TOPICS_FILE, []);
  topics.push({ id: `topic-${Date.now()}`, name: name.slice(0, 80), category, nextStep, minutes, done: false });
  writeJson(TOPICS_FILE, topics);
  res.redirect('/?message=' + encodeURIComponent('Topic add ho gaya. Bas chhota step complete karo.'));
});

app.post('/topics/:id/toggle', (req, res) => {
  const topics = readJson(TOPICS_FILE, []);
  const topic = topics.find(t => t.id === req.params.id);
  if (topic) topic.done = !topic.done;
  writeJson(TOPICS_FILE, topics);
  res.redirect('/');
});

app.post('/topics/:id/delete', (req, res) => {
  const topics = readJson(TOPICS_FILE, []).filter(t => t.id !== req.params.id);
  writeJson(TOPICS_FILE, topics);
  res.redirect('/');
});

app.post('/sessions', (req, res) => {
  const minutes = Math.max(1, Math.min(120, Number(req.body.minutes) || 10));
  const topicId = (req.body.topicId || '').trim();
  const topic = readJson(TOPICS_FILE, []).find(t => t.id === topicId);
  const sessions = readJson(LOG_FILE, []);
  sessions.push({
    id: `session-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    minutes,
    topicId,
    topicName: topic ? topic.name : 'Quick revision',
    note: (req.body.note || '').trim().slice(0, 240)
  });
  writeJson(LOG_FILE, sessions);
  res.json({ ok: true, minutes });
});

app.post('/reset-today', (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const sessions = readJson(LOG_FILE, []).filter(s => s.date !== today);
  writeJson(LOG_FILE, sessions);
  res.redirect('/');
});

app.listen(PORT, () => console.log(`Revision Starter running at http://localhost:${PORT}`));
