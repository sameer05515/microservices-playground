// index.js
const express = require('express');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');

const app = express();
const port = 3001;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Base endpoint to render the form
app.get('/', (req, res) => {
    res.render('index', { rawText:'', textType:'text', metadata:{}, errorMessage: '' });
});

// Endpoint to process the input text and extract metadata
// app.post('/process', (req, res) => {
//     const { rawText, textType } = req.body;

//     let metadata = {};
//     if (textType === 'yaml') {
//         try {
//             metadata = yaml.load(rawText);
//         } catch (e) {
//             return res.status(400).json({ error: 'Invalid YAML format' });
//         }
//     } else if (textType === 'markdown') {
//         // Add Markdown processing logic here
//         // For now, let's return a placeholder response
//         metadata = { message: 'Metadata extraction from Markdown is not implemented yet' };
//     } else {
//         // Add plain text processing logic here
//         // For now, let's return a placeholder response
//         metadata = { message: 'Metadata extraction from plain text is not implemented yet' };
//     }

//     res.json({
//         rawText,
//         textType,
//         metadata
//     });
// });

// Endpoint to process the input text and extract metadata
// app.post('/process', (req, res) => {
//     const { rawText, textType } = req.body;

//     let metadata = {};
//     if (textType === 'yaml') {
//         try {
//             metadata = yaml.load(rawText);
//         } catch (e) {
//             return res.status(400).json({ error: 'Invalid YAML format' });
//         }
//     } else if (textType === 'markdown') {
//         // Add Markdown processing logic here
//         // For now, let's return a placeholder response
//         metadata = { message: 'Metadata extraction from Markdown is not implemented yet' };
//     } else {
//         // Add plain text processing logic here
//         // For now, let's return a placeholder response
//         metadata = { message: 'Metadata extraction from plain text is not implemented yet' };
//     }

//     res.render('index', { response: { rawText, textType, metadata } });
// });

// Endpoint to process the input text and extract metadata
app.post('/process', (req, res) => {
    const { rawText, textType } = req.body;

    let metadata = {};
    let errorMessage = '';
    if (textType === 'yaml') {
        try {
            metadata = yaml.load(rawText);
        } catch (e) {
            if (e.mark) {
                // If the error has 'mark' property, it contains line and column information
                const errorLine = e.mark.line + 1; // Adjust for 0-based index
                errorMessage = `Error parsing YAML at line ${errorLine}: ${e.message}`;
            } else {
                // If the error does not have 'mark' property, it's a general parsing error
                errorMessage = `Error parsing YAML: ${e.message}`;
            }
        }
    } else if (textType === 'markdown') {
        // Add Markdown processing logic here
        // For now, let's return a placeholder response
        metadata = { message: 'Metadata extraction from Markdown is not implemented yet' };
    } else {
        // Add plain text processing logic here
        // For now, let's return a placeholder response
        metadata = { message: 'Metadata extraction from plain text is not implemented yet' };
    }

    res.render('index', { rawText, textType, metadata, errorMessage });
});




// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
