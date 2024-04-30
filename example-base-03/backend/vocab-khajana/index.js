const fs = require('fs');
const xml2js = require('xml2js');

// Read XML file
fs.readFile('./xml-data/khajana.xml', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading XML file:', err);
        return;
    }

    // Parse XML to JSON
    xml2js.parseString(data, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        // Extract "myword" data
        const myWords = result['vocab-config']['word-list'][0]['myword'];

        // Write formatted data to JSON file
        fs.writeFile('./json-data/raw-vocab.json', JSON.stringify(result, null, 2), err => {
            if (err) {
                console.error('Error writing JSON file:', err);
                return;
            }
            console.log('Raw Data has been successfully written to vocab.json');
        });

        // Extract necessary data and format it
        const formattedData = myWords.map(word => ({
            word: word.word[0]['_'],
            type: word.word[0]['$'].type,
            // meanings: word.meanings[0].meaning.map(meaning => meaning._),
            // examples: word.examples[0].example.map(example => example._)
            meanings: word.meanings[0].meaning,
            examples: word.examples[0].example
        }));

        // Write formatted data to JSON file
        fs.writeFile('./json-data/vocab.json', JSON.stringify(formattedData, null, 2), err => {
            if (err) {
                console.error('Error writing JSON file:', err);
                return;
            }
            console.log('Data has been successfully written to vocab.json');
        });
    });
});
