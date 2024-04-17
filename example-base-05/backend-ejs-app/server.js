const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3002;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Route to serve index.ejs
app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint to fetch Java topics
app.get('/topics', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001/topics');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch Java books
app.get('/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3001/books');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
