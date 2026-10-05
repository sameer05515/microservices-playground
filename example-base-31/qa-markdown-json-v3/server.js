const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'questions.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

async function readQuestions() {
  const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));

  // Imported question-bank JSON is an export object:
  // { version, exportedAt, tags, questions: [...] }
  // Internally the API works with the questions array.
  const questions = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
  if (!questions) throw new Error('Invalid question-bank JSON: expected an array or an object containing questions[]');
  return questions.map(normalizeQuestion);

}

function normalizeQuestion(item) {
  const answers = Array.isArray(item.answers) ? item.answers.map((a, i) => {
    if (typeof a === 'string') return { id: `${item.id || 'q'}_a${i + 1}`, title: `Answer ${i + 1}`, markdown: a };
    return { id: a.id || `${item.id || 'q'}_a${i + 1}`, title: String(a.title || `Answer ${i + 1}`), markdown: String(a.markdown || a.answer || a.text || '') };
  }) : [];
  return { ...item, answers };
}

async function writeQuestions(questions) {
  const existing = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  const output = Array.isArray(existing)
    ? questions
    : {
        ...existing,
        questions
      };

  const tmp = `${DATA_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(output, null, 2), 'utf8');
  await fs.rename(tmp, DATA_FILE);
}

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

app.get('/api/questions', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    let questions = await readQuestions();
    if (q) {
      questions = questions.filter(item => {
        const haystack = [item.question, ...(item.tags || []), ...(item.answers || []).map(a => typeof a === 'string' ? a : `${a.title || ''} ${a.markdown || a.answer || a.text || ''}`)]
          .join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    res.json(questions);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/questions/:id', async (req, res) => {
  try {
    const questions = await readQuestions();
    const item = questions.find(x => x.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Question not found' });
    res.json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/questions', async (req, res) => {
  try {
    const { question, tags = [], answers = [] } = req.body;
    if (!String(question || '').trim()) return res.status(400).json({ error: 'Question is required' });
    const item = {
      id: id('q'), question: String(question).trim(),
      tags: Array.isArray(tags) ? tags.map(String).map(x => x.trim()).filter(Boolean) : [],
      answers: Array.isArray(answers) ? answers.map(a => ({ id: id('a'), title: String(a.title || 'Answer').trim(), markdown: String(a.markdown || '') })) : []
    };
    const questions = await readQuestions();
    questions.unshift(item);
    await writeQuestions(questions);
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const questions = await readQuestions();
    const index = questions.findIndex(x => x.id === req.params.id);
    if (index < 0) return res.status(404).json({ error: 'Question not found' });
    const old = questions[index];
    questions[index] = {
      ...old,
      question: String(req.body.question ?? old.question).trim(),
      tags: Array.isArray(req.body.tags) ? req.body.tags.map(String).map(x => x.trim()).filter(Boolean) : old.tags,
      answers: Array.isArray(req.body.answers) ? req.body.answers.map(a => ({ id: a.id || id('a'), title: String(a.title || 'Answer').trim(), markdown: String(a.markdown || '') })) : old.answers
    };
    await writeQuestions(questions);
    res.json(questions[index]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const questions = await readQuestions();
    const next = questions.filter(x => x.id !== req.params.id);
    if (next.length === questions.length) return res.status(404).json({ error: 'Question not found' });
    await writeQuestions(next);
    res.status(204).end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/markdown', (req, res) => {
  res.json({ html: marked.parse(String(req.body.markdown || '')) });
});

app.listen(PORT, () => console.log(`Q&A app running at http://localhost:${PORT}`));
