const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'topics.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const now = new Date();
    const demo = [
      { id: 'java-collections', title: 'Java Collections', category: 'Java', notes: 'List vs Set vs Map; HashMap internals', intervalDays: 1, lastReviewed: null, nextReview: now.toISOString(), reviewCount: 0 },
      { id: 'spring-di', title: 'Spring Dependency Injection', category: 'Spring Boot', notes: 'IoC, DI, constructor injection, bean scopes', intervalDays: 1, lastReviewed: null, nextReview: now.toISOString(), reviewCount: 0 },
      { id: 'react-hooks', title: 'React Hooks', category: 'React', notes: 'useState, useEffect, dependency array', intervalDays: 1, lastReviewed: null, nextReview: now.toISOString(), reviewCount: 0 }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(demo, null, 2));
  }
}
function readTopics() {
  ensureData();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch (err) { console.error('Could not read topics.json:', err); return []; }
}
function saveTopics(topics) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(topics, null, 2));
}
function newId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function startOfToday(d = new Date()) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function isDue(topic) { return !topic.nextReview || new Date(topic.nextReview) <= new Date(); }
function formatDate(value) {
  if (!value) return 'Not reviewed yet';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}
function dueLabel(topic) {
  if (isDue(topic)) return 'Due now';
  return `Due ${new Date(topic.nextReview).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}

app.get('/', (req, res) => {
  const topics = readTopics().sort((a, b) => new Date(a.nextReview || 0) - new Date(b.nextReview || 0));
  const dueTopics = topics.filter(isDue);
  res.render('index', {
    topics, dueTopics, total: topics.length, dueCount: dueTopics.length,
    reviewedCount: topics.filter(t => t.lastReviewed && startOfToday(new Date(t.lastReviewed)).getTime() === startOfToday().getTime()).length,
    formatDate, dueLabel, today: new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })
  });
});

app.post('/topics', (req, res) => {
  const title = (req.body.title || '').trim();
  if (!title) return res.redirect('/');
  const interval = Math.max(1, Math.min(60, Number.parseInt(req.body.intervalDays, 10) || 1));
  const topics = readTopics();
  topics.push({
    id: newId(), title, category: (req.body.category || 'General').trim() || 'General',
    notes: (req.body.notes || '').trim(), intervalDays: interval,
    lastReviewed: null, nextReview: new Date().toISOString(), reviewCount: 0
  });
  saveTopics(topics);
  res.redirect('/');
});

app.post('/topics/:id/review', (req, res) => {
  const topics = readTopics();
  const topic = topics.find(t => t.id === req.params.id);
  if (topic) {
    const now = new Date();
    const intervals = [1, 3, 7, 14, 30];
    const nextInterval = intervals[Math.min(topic.reviewCount || 0, intervals.length - 1)];
    topic.lastReviewed = now.toISOString();
    topic.reviewCount = (topic.reviewCount || 0) + 1;
    topic.intervalDays = nextInterval;
    const next = new Date(now);
    next.setDate(next.getDate() + nextInterval);
    topic.nextReview = next.toISOString();
    saveTopics(topics);
  }
  res.redirect('/');
});

app.post('/topics/:id/snooze', (req, res) => {
  const topics = readTopics();
  const topic = topics.find(t => t.id === req.params.id);
  if (topic) {
    const next = new Date();
    next.setHours(next.getHours() + 2);
    topic.nextReview = next.toISOString();
    saveTopics(topics);
  }
  res.redirect('/');
});

app.post('/topics/:id/delete', (req, res) => {
  saveTopics(readTopics().filter(t => t.id !== req.params.id));
  res.redirect('/');
});

app.post('/settings/reminder', (req, res) => {
  const hour = Math.max(0, Math.min(23, Number.parseInt(req.body.hour, 10) || 9));
  const minute = Math.max(0, Math.min(59, Number.parseInt(req.body.minute, 10) || 0));
  const settingsFile = path.join(DATA_DIR, 'settings.json');
  fs.writeFileSync(settingsFile, JSON.stringify({ hour, minute }, null, 2));
  res.redirect('/');
});

app.get('/api/reminders', (req, res) => {
  const topics = readTopics().filter(isDue).map(t => ({ id: t.id, title: t.title, category: t.category }));
  res.json({ due: topics, count: topics.length });
});

app.get('/api/settings', (req, res) => {
  const settingsFile = path.join(DATA_DIR, 'settings.json');
  let settings = { hour: 9, minute: 0 };
  try { if (fs.existsSync(settingsFile)) settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8')); } catch (_) {}
  res.json(settings);
});

app.listen(PORT, () => {
  ensureData();
  console.log(`Revision Reminder is running at http://localhost:${PORT}`);
});
