const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 3001; // You can change this if needed
const path = require('path');

// Set the view engine to EJS
app.set('view engine', 'ejs');
// Set the directory for views
app.set('views', path.join(__dirname, 'views'));

// Define the frontend service URL
const frontendServiceUrl = process.env.FRONTEND_SERVICE_URL || 'http://localhost:3002';

// Middleware to set CORS headers
// app.use((req, res, next) => {
//     // Allow requests from frontend service origin
//     res.setHeader('Access-Control-Allow-Origin', frontendServiceUrl); // Externalized URL
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
//     next();
// });

// Enable CORS globally
app.use(cors());

// Define your routes
app.get('/', (req, res) => {
    console.log(`process.env.FRONTEND_SERVICE_URL : ${process.env.FRONTEND_SERVICE_URL}`);
    res.render('index', {frontendServiceUrl:process.env.FRONTEND_SERVICE_URL});
});

app.get('/words', (req, res) => {
    console.log(`process.env.FRONTEND_SERVICE_URL : ${process.env.FRONTEND_SERVICE_URL}`);
    const words = ['Apple', 'Banana', 'Car', 'Donkey'];
    res.json({ words });
});

// New endpoint to handle GET "/words/:id"
app.get('/words/:id', (req, res) => {
    const { id } = req.params;
    // You can handle the request for a specific word ID here
    // For demonstration purposes, let's just return the requested ID
    res.json({ message:"You have requested for word having id: "+id, id });
});

// Start the server
app.listen(port, () => {
    console.log(`Words Server is running on http://localhost:${port}`);
});
