import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import cors from "cors"

const app = express();
app.use(bodyParser.json());
app.use(cors())

const DATA_FILE = 'D:/GIT/my-backup/02-Oct-2025/words/repo.json';
// const DATA_FILE = './words.json';

// Read data
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

// Write data
const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data));
};

// Get all words
app.get('/words', async (req, res) => {
  const data = await readData();
  res.json(data);
});

// Get word by id
app.get('/words/:id', async (req, res) => {
  const data = await readData();
  const word = data.find(w => w.id === req.params.id);
  if (!word) return res.status(404).json({ error: 'Word not found' });
  res.json(word);
});

// Create word
app.post('/words', async (req, res) => {
  const { word, meanings = [], examples = [], description = '' } = req.body;
  const newWord = { id: uuidv4(), word, meanings, examples, description, createdOn: new Date().toISOString() };
  
  const data = await readData();
  data.push(newWord);
  await writeData(data);
  res.status(201).json(newWord);
});

// Update word
app.put('/words/:id', async (req, res) => {
  const data = await readData();
  const index = data.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Word not found' });

  const { word, meanings, examples, description } = req.body;
  data[index] = {
    ...data[index],
    word: word ?? data[index].word,
    meanings: meanings ?? data[index].meanings,
    examples: examples ?? data[index].examples,
    description: description ?? data[index].description
  };
  
  await writeData(data);
  res.json(data[index]);
});

// Delete word
app.delete('/words/:id', async (req, res) => {
  const data = await readData();
  const index = data.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Word not found' });

  const deletedWord = data.splice(index, 1)[0];
  await writeData(data);
  res.json(deletedWord);
});

// Start server
const PORT = 3090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
