const express = require('express');
const app = express();
const PORT = 3001;

// Endpoint to return success message
app.get('/', (req, res) => {
  res.json({ message: 'success' });
});

// Endpoint to return array of Java topics names
app.get('/topics', (req, res) => {
  const topics = ['Java Basics', 'Object-Oriented Programming', 'Concurrency', 'Collections', 'Spring Framework'];
  res.json(topics);
});

// Endpoint to return array of Java books names
app.get('/books', (req, res) => {
  const books = ['Effective Java', 'Head First Java', 'Java Concurrency in Practice', 'Clean Code', 'Java Cookbook'];
  res.json(books);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
