const express = require('express');
const path = require('path');
const { marked } = require('marked');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB || 'ques_ans_db';

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let client;
let db;

async function connectMongo() {
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  // Existing question-bank imports may not have an application-level `id` field.
  // Backfill missing/null/duplicate ids before creating the unique indexes.
  await ensureApplicationIds(db.collection('questions'), 'q');
  await ensureApplicationIds(db.collection('tags'), 'tag');
  await db.collection('questions').createIndex({ id: 1 }, { unique: true });
  await db.collection('tags').createIndex({ id: 1 }, { unique: true });
  await db.collection('tags').createIndex({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
  console.log(`MongoDB connected: ${DB_NAME}`);
}

function id(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`; }
async function ensureApplicationIds(collection, prefix) {
  // Remove an old id index first; it may have been created by a previous run
  // and can prevent us from repairing null/duplicate ids.
  try { await collection.dropIndex('id_1'); } catch (e) {
    if (e.codeName !== 'IndexNotFound' && e.code !== 27) throw e;
  }

  const docs = await collection.find({}, { projection: { _id: 1, id: 1 } }).toArray();
  const used = new Set();
  for (const doc of docs) {
    const current = doc.id == null ? '' : String(doc.id).trim();
    if (current && !used.has(current)) {
      used.add(current);
      if (doc.id !== current) await collection.updateOne({ _id: doc._id }, { $set: { id: current } });
      continue;
    }
    let next;
    do { next = id(prefix); } while (used.has(next));
    used.add(next);
    await collection.updateOne({ _id: doc._id }, { $set: { id: next } });
  }
}

function cleanTags(tags) { return [...new Set((Array.isArray(tags) ? tags : []).map(String).map(x => x.trim()).filter(Boolean))]; }
function normalizeAnswer(a, questionId, index) {
  if (typeof a === 'string') return { id: `${questionId || 'q'}_a${index + 1}`, title: `Answer ${index + 1}`, markdown: a };
  const answer = a && typeof a === 'object' ? a : {};
  return { id: answer.id || id('a'), title: String(answer.title || `Answer ${index + 1}`).trim(), markdown: String(answer.markdown ?? answer.answer ?? answer.text ?? '') };
}
function normalizeQuestion(item) {
  return {
    ...item,
    id: String(item.id || id('q')),
    question: String(item.question || ''),
    tags: cleanTags(item.tags),
    answers: Array.isArray(item.answers) ? item.answers.map((a, i) => normalizeAnswer(a, item.id, i)) : []
  };
}
function normalizeTag(item) { return { ...item, id: String(item.id || id('tag')), name: String(item.name || '').trim() }; }
function stripMongo(doc) { if (!doc) return doc; const { _id, ...rest } = doc; return rest; }
function questionsCollection() { return db.collection('questions'); }
function tagsCollection() { return db.collection('tags'); }

// Export database contents.
app.get('/api/export', async (req, res) => {
  try {
    const questions = (await questionsCollection().find({}).toArray()).map(stripMongo).map(normalizeQuestion);
    const tags = (await tagsCollection().find({}).toArray()).map(stripMongo).map(normalizeTag);
    res.setHeader('Content-Disposition', 'attachment; filename=question-bank-export.json');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.send(JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), tags, questions }, null, 2));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Import into MongoDB, replacing current questions and tags.
app.post('/api/import', async (req, res) => {
  try {
    const incoming = req.body;
    const data = Array.isArray(incoming) ? { tags: [], questions: incoming } : incoming;
    if (!data || !Array.isArray(data.questions)) return res.status(400).json({ error: 'Invalid import JSON: expected questions[]' });
    const questions = data.questions.map((q, i) => normalizeQuestion({ ...q, id: q.id || id('q') }));
    const tags = (Array.isArray(data.tags) ? data.tags : []).map(t => typeof t === 'string' ? { id: id('tag'), name: t.trim() } : normalizeTag({ ...t, id: t.id || id('tag') })).filter(t => t.name);
    await questionsCollection().deleteMany({});
    await tagsCollection().deleteMany({});
    if (questions.length) await questionsCollection().insertMany(questions);
    if (tags.length) await tagsCollection().insertMany(tags);
    res.json({ imported: true, questions: questions.length, tags: tags.length });
  } catch (e) { res.status(400).json({ error: `Import failed: ${e.message}` }); }
});

// Questions CRUD.
app.get('/api/questions', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    let questions = (await questionsCollection().find({}).sort({ _id: 1 }).toArray()).map(stripMongo).map(normalizeQuestion);
    if (q) questions = questions.filter(item => {
      const haystack = [item.question, ...(item.tags || []), ...(item.answers || []).map(a => `${a.title || ''} ${a.markdown || ''}`)].join(' ').toLowerCase();
      return haystack.includes(q);
    });
    res.json(questions);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/questions/:id', async (req, res) => {
  try {
    const item = await questionsCollection().findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Question not found' });
    res.json(normalizeQuestion(stripMongo(item)));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/questions', async (req, res) => {
  try {
    const question = String(req.body.question || '').trim();
    if (!question) return res.status(400).json({ error: 'Question is required' });
    const item = normalizeQuestion({
      id: id('q'), question,
      tags: cleanTags(req.body.tags),
      answers: Array.isArray(req.body.answers) ? req.body.answers : []
    });
    await questionsCollection().insertOne(item);
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const oldDoc = await questionsCollection().findOne({ id: req.params.id });
    if (!oldDoc) return res.status(404).json({ error: 'Question not found' });
    const old = normalizeQuestion(stripMongo(oldDoc));
    const answersChanged = req.body?.answersChanged === true;
    const update = {
      question: String(req.body.question ?? old.question).trim(),
      tags: Array.isArray(req.body.tags) ? cleanTags(req.body.tags) : old.tags
    };
    if (answersChanged && Array.isArray(req.body.answers)) {
      update.answers = req.body.answers.map((a, i) => normalizeAnswer(a, old.id, i));
    }
    await questionsCollection().updateOne({ id: req.params.id }, { $set: update });
    res.json(normalizeQuestion(stripMongo(await questionsCollection().findOne({ id: req.params.id }))));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const result = await questionsCollection().deleteOne({ id: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ error: 'Question not found' });
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Tags CRUD.
app.get('/api/tags', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    let tags = (await tagsCollection().find({}).sort({ name: 1 }).toArray()).map(stripMongo).map(normalizeTag);
    if (q) tags = tags.filter(t => t.name.toLowerCase().includes(q));
    res.json(tags);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/tags/:id', async (req, res) => {
  try {
    const tag = await tagsCollection().findOne({ id: req.params.id });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.json(normalizeTag(stripMongo(tag)));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/tags', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Tag name is required' });
    const duplicate = await tagsCollection().findOne({ name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' } });
    if (duplicate) return res.status(409).json({ error: 'Tag already exists' });
    const tag = { id: id('tag'), name };
    await tagsCollection().insertOne(tag);
    res.status(201).json(tag);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/tags/:id', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Tag name is required' });
    const old = await tagsCollection().findOne({ id: req.params.id });
    if (!old) return res.status(404).json({ error: 'Tag not found' });
    const duplicate = await tagsCollection().findOne({ id: { $ne: req.params.id }, name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' } });
    if (duplicate) return res.status(409).json({ error: 'Tag already exists' });
    await tagsCollection().updateOne({ id: req.params.id }, { $set: { name } });
    // Keep questions consistent if they store tag IDs.
    res.json({ id: req.params.id, name });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/tags/:id', async (req, res) => {
  try {
    const tag = await tagsCollection().findOne({ id: req.params.id });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    await tagsCollection().deleteOne({ id: req.params.id });
    await questionsCollection().updateMany({}, { $pull: { tags: req.params.id } });
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
app.post('/api/markdown', (req, res) => res.json({ html: marked.parse(String(req.body.markdown || '')) }));
app.get('/question/:id', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Q&A app running at http://localhost:${PORT}`));
}).catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});
