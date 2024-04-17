const express = require('express');
const app = express();
const port = 3000; // You can change this if needed
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Middleware to set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002'); // Allow requests from this origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
});

// Define your routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/topics', (req, res) => {
    const topics = ['Node.js', 'Express', 'JavaScript', 'EJS'];
    res.json({ topics });
});

// Start the server
app.listen(port, () => {
    console.log(`Topics Server is running on http://localhost:${port}`);
});
