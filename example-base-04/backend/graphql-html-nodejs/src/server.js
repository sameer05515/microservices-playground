const express = require('express');
const { getAllResumes } = require('./graphql');
require('dotenv').config();

const app = express();
// const port = 3000;
const port = process.env.port || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', async (req, res) => {
    try {
        const resumes = await getAllResumes();
        res.render('resumes', { resumes });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
