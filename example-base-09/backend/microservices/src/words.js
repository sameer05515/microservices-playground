const express = require('express');
const { Eureka } = require('eureka-js-client');

const app = express();
const port = 3002;

let words = [{ id: 1, word: 'Node' }, { id: 2, word: 'Express' }];

app.use(express.json());

app.get('/words', (req, res) => res.json(words));

app.post('/words', (req, res) => {
    const word = { id: words.length + 1, word: req.body.word };
    words.push(word);
    res.status(201).json(word);
});

app.put('/words/:id', (req, res) => {
    const word = words.find(w => w.id === parseInt(req.params.id));
    if (!word) return res.status(404).send('The word was not found.');

    word.word = req.body.word;
    res.json(word);
});

app.delete('/words/:id', (req, res) => {
    const wordIndex = words.findIndex(w => w.id === parseInt(req.params.id));
    if (wordIndex === -1) return res.status(404).send('The word was not found.');

    const deletedWord = words.splice(wordIndex, 1);
    res.json(deletedWord);
});

const client = new Eureka({
    instance: {
        app: 'words-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': port,
            '@enabled': 'true',
        },
        vipAddress: 'words-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

app.listen(port, () => {
    console.log(`Words service listening on port ${port}!`);
    client.start((error) => {
        console.log(error || 'Words service registered with Eureka');
    });
});
