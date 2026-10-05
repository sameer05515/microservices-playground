const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'questions.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function readData() {
  const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  if (Array.isArray(data)) return { version: 2, tags: [], questions: data };
  if (!data || !Array.isArray(data.questions)) throw new Error('Invalid question-bank JSON');
  if (!Array.isArray(data.tags)) data.tags = [];
  return data;
}

function normalizeQuestion(item) {
  const answers = Array.isArray(item.answers) ? item.answers.map((a, i) => {
    if (typeof a === 'string') return { id: `${item.id || 'q'}_a${i + 1}`, title: `Answer ${i + 1}`, markdown: a };
    return { id: a.id || `${item.id || 'q'}_a${i + 1}`, title: String(a.title || `Answer ${i + 1}`), markdown: String(a.markdown || a.answer || a.text || '') };
  }) : [];
  return { ...item, answers };
}

async function readQuestions() {
  const data = await readData();
  return data.questions.map(normalizeQuestion);
}

async function readTags() {
  const data = await readData();
  return data.tags;
}

async function writeData(data) {
  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

function id(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
function cleanTags(tags) { return [...new Set((Array.isArray(tags) ? tags : []).map(String).map(x => x.trim()).filter(Boolean))]; }

// Import / Export
app.get('/api/export', async (req, res) => {
  try {
    const data = await readData();
    res.setHeader('Content-Disposition', 'attachment; filename=question-bank-export.json');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify(data, null, 2));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/import', async (req, res) => {
  try {
    const incoming = req.body;
    const data = Array.isArray(incoming)
      ? { version: 2, exportedAt: new Date().toISOString(), tags: [], questions: incoming }
      : incoming;
    if (!data || !Array.isArray(data.questions)) {
      return res.status(400).json({ error: 'Invalid import JSON: expected questions[]' });
    }
    const tags = Array.isArray(data.tags) ? data.tags : [];
    const questions = data.questions.map(normalizeQuestion);
    await writeData({
      version: data.version || 2,
      exportedAt: data.exportedAt || new Date().toISOString(),
      tags,
      questions
    });
    res.json({ imported: true, questions: questions.length, tags: tags.length });
  } catch (e) { res.status(400).json({ error: `Import failed: ${e.message}` }); }
});

// Questions
app.get('/api/questions', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    let questions = await readQuestions();
    if (q) {
      questions = questions.filter(item => {
        const haystack = [item.question, ...(item.tags || []), ...(item.answers || []).map(a => typeof a === 'string' ? a : `${a.title || ''} ${a.markdown || a.answer || a.text || ''}`)].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    res.json(questions);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/questions/:id', async (req, res) => {
  try {
    const item = (await readQuestions()).find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Question not found' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/questions', async (req, res) => {
  try {
    const { question, tags = [], answers = [] } = req.body;
    if (!String(question || '').trim()) return res.status(400).json({ error: 'Question is required' });
    const data = await readData();
    const itemId = id('q');
    const item = {
      id: itemId, question: String(question).trim(), tags: cleanTags(tags),
      answers: Array.isArray(answers) ? answers.map((a, i) => normalizeAnswer(a, itemId, i)) : []
    };
    data.questions.unshift(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

function normalizeAnswer(a, questionId, index) {
  if (typeof a === 'string') {
    return { id: `${questionId || 'q'}_a${index + 1}`, title: `Answer ${index + 1}`, markdown: a };
  }
  const answer = a && typeof a === 'object' ? a : {};
  return {
    id: answer.id || id('a'),
    title: String(answer.title || `Answer ${index + 1}`).trim(),
    markdown: String(answer.markdown ?? answer.answer ?? answer.text ?? '')
  };
}

app.put('/api/questions/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.questions.findIndex(x => x.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: 'Question not found' });

    const old = normalizeQuestion(data.questions[index]);
    const hasAnswers = Object.prototype.hasOwnProperty.call(req.body || {}, 'answers');
    // Empty/missing answers on an update are treated as 'not supplied' so a normal
    // question/tag edit can never accidentally erase the existing answers.
    const incomingAnswers = hasAnswers && Array.isArray(req.body.answers) && req.body.answers.length > 0
      ? req.body.answers.map((a, i) => normalizeAnswer(a, old.id, i))
      : old.answers;

    data.questions[index] = {
      ...old,
      question: String(req.body.question ?? old.question).trim(),
      tags: Array.isArray(req.body.tags) ? cleanTags(req.body.tags) : old.tags,
      answers: incomingAnswers
    };

    await writeData(data);
    res.json(normalizeQuestion(data.questions[index]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const data = await readData();
    const next = data.questions.filter(x => x.id !== req.params.id);
    if (next.length === data.questions.length) return res.status(404).json({ error: 'Question not found' });
    data.questions = next;
    await writeData(data);
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Tags CRUD: create, retrieve/list, retrieve by id, update, delete.
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await readTags();
    const q = String(req.query.q || '').trim().toLowerCase();
    res.json(q ? tags.filter(t => String(t.name).toLowerCase().includes(q)) : tags);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/tags/:id', async (req, res) => {
  try {
    const tag = (await readTags()).find(t => t.id === req.params.id);
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json(tag);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tags', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Tag name is required' });
    const data = await readData();
    if (data.tags.some(t => String(t.name).toLowerCase() === name.toLowerCase())) return res.status(409).json({ error: 'Tag already exists' });
    const tag = { id: id('tag'), name };
    data.tags.push(tag);
    await writeData(data);
    res.status(201).json(tag);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/tags/:id', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Tag name is required' });
    const data = await readData();
    const index = data.tags.findIndex(t => t.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: 'Tag not found' });
    if (data.tags.some((t, i) => i !== index && String(t.name).toLowerCase() === name.toLowerCase())) return res.status(409).json({ error: 'Tag already exists' });
    data.tags[index] = { ...data.tags[index], name };
    await writeData(data);
    res.json(data.tags[index]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/tags/:id', async (req, res) => {
  try {
    const data = await readData();
    const exists = data.tags.some(t => t.id === req.params.id);
    if (!exists) return res.status(404).json({ error: 'Tag not found' });
    data.tags = data.tags.filter(t => t.id !== req.params.id);
    // Detach deleted tag from all questions.
    data.questions = data.questions.map(q => ({ ...q, tags: Array.isArray(q.tags) ? q.tags.filter(t => t !== req.params.id) : [] }));
    await writeData(data);
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/markdown', (req, res) => res.json({ html: marked.parse(String(req.body.markdown || '')) }));

// Public question detail route. The client loads the question by id from /api/questions/:id.
app.get('/question/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Q&A app running at http://localhost:${PORT}`));
