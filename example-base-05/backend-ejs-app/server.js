const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3002;
/** In Docker Compose use service name; locally use localhost (see docker-compose.yml). */
const BACKEND_BASE = process.env.BACKEND_URL || 'http://localhost:3001';

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route to serve index.ejs
app.get('/', (req, res) => {
  res.render('index');
});

// Proxy API root JSON (so the UI can fetch JSON from same origin)
app.get('/success', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_BASE}/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch Java topics
app.get('/topics', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_BASE}/topics`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch Java books
app.get('/books', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_BASE}/books`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
