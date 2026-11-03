const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tracker.json');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const schedule = {
  1: { name: 'Monday', track: 'Java', focus: ['Core Java concept revision', 'Java coding practice', 'Java interview questions'] },
  2: { name: 'Tuesday', track: 'JavaScript', focus: ['JavaScript concept revision', 'JavaScript coding practice', 'React interview questions'] },
  3: { name: 'Wednesday', track: 'Java', focus: ['Collections / Streams revision', 'Java coding practice', 'Spring Boot interview questions'] },
  4: { name: 'Thursday', track: 'JavaScript', focus: ['ES6+ concept revision', 'JavaScript coding practice', 'React interview questions'] },
  5: { name: 'Friday', track: 'Java', focus: ['Multithreading / JVM revision', 'Java coding practice', 'Microservices interview questions'] },
  6: { name: 'Saturday', track: 'JavaScript', focus: ['Async JS / Event Loop revision', 'JavaScript coding practice', 'React interview questions'] },
  0: { name: 'Sunday', track: 'Rest & Retrospection', focus: ['Rest and recharge', 'Review weekly progress', 'Plan next week'] }
};

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function parseDate(value) {
  const d = value ? new Date(`${value}T12:00:00`) : new Date();
  return Number.isNaN(d.getTime()) ? new Date() : d;
}
function readData() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data.days ||= {};
    data.retrospectives ||= {};
    return data;
  } catch {
    return { days: {}, retrospectives: {} };
  }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
function getDay(data, date) {
  const key = dateKey(date);
  if (!data.days[key]) {
    const plan = schedule[date.getDay()];
    data.days[key] = {
      date: key,
      track: plan.track,
      tasks: plan.focus.map((label, i) => ({ id: String(i + 1), label, done: false })),
      codingMinutes: 0,
      questionsPracticed: 0,
      problemsSolved: 0,
      notes: ''
    };
  }
  return data.days[key];
}
function weekDates(anchor) {
  const monday = new Date(anchor);
  const offset = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
function weekStats(data, dates) {
  const rows = dates.map(d => {
    const entry = data.days[dateKey(d)];
    const tasks = entry?.tasks || [];
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    return { date: dateKey(d), day: schedule[d.getDay()].name, track: schedule[d.getDay()].track, total, done, percent: total ? Math.round(done / total * 100) : 0, exists: !!entry };
  });
  const total = rows.reduce((n, r) => n + r.total, 0);
  const done = rows.reduce((n, r) => n + r.done, 0);
  return { rows, total, done, percent: total ? Math.round(done / total * 100) : 0 };
}

app.get('/', (req, res) => {
  const data = readData();
  const selected = parseDate(req.query.date);
  const day = getDay(data, selected);
  writeData(data);
  const dates = weekDates(selected);
  const stats = weekStats(data, dates);
  const key = dateKey(selected);
  res.render('index', {
    day, selected, key, schedule, stats,
    dateKey,
    todayKey: dateKey(new Date()),
    query: req.query,
    prettyDate: selected.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    prevDate: dateKey(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() - 1)),
    nextDate: dateKey(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + 1)),
    retrospective: data.retrospectives[weekKey(selected)] || { wins: '', challenges: '', nextWeek: '' }
  });
});
function weekKey(date) { return dateKey(weekDates(date)[0]); }

app.post('/day/:date/tasks', (req, res) => {
  const data = readData();
  const day = getDay(data, parseDate(req.params.date));
  day.tasks.forEach(task => { task.done = Array.isArray(req.body.completed) && req.body.completed.includes(task.id); });
  day.codingMinutes = Math.max(0, Number(req.body.codingMinutes) || 0);
  day.questionsPracticed = Math.max(0, Number(req.body.questionsPracticed) || 0);
  day.problemsSolved = Math.max(0, Number(req.body.problemsSolved) || 0);
  day.notes = (req.body.notes || '').trim();
  writeData(data);
  res.redirect(`/?date=${day.date}&saved=1`);
});

app.post('/retrospective/:week', (req, res) => {
  const data = readData();
  data.retrospectives[req.params.week] = {
    wins: (req.body.wins || '').trim(),
    challenges: (req.body.challenges || '').trim(),
    nextWeek: (req.body.nextWeek || '').trim(),
    updatedAt: new Date().toISOString()
  };
  writeData(data);
  res.redirect(`/?date=${req.params.week}&reviewSaved=1#retrospective`);
});

app.get('/history', (req, res) => {
  const data = readData();
  const rows = Object.values(data.days).sort((a, b) => b.date.localeCompare(a.date));
  res.render('history', { rows });
});

app.listen(PORT, () => console.log(`Revision Tracker running at http://localhost:${PORT}`));
