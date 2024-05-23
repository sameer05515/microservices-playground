const express = require('express');
const { Eureka } = require('eureka-js-client');

const app = express();
const port = 3001;

let topics = [{ id: 1, name: 'JavaScript' }, { id: 2, name: 'Node.js' }];

app.use(express.json());

app.get('/topics', (req, res) => res.json(topics));

app.post('/topics', (req, res) => {
    const topic = { id: topics.length + 1, name: req.body.name };
    topics.push(topic);
    res.status(201).json(topic);
});

app.put('/topics/:id', (req, res) => {
    const topic = topics.find(t => t.id === parseInt(req.params.id));
    if (!topic) return res.status(404).send('The topic was not found.');

    topic.name = req.body.name;
    res.json(topic);
});

app.delete('/topics/:id', (req, res) => {
    const topicIndex = topics.findIndex(t => t.id === parseInt(req.params.id));
    if (topicIndex === -1) return res.status(404).send('The topic was not found.');

    const deletedTopic = topics.splice(topicIndex, 1);
    res.json(deletedTopic);
});

const client = new Eureka({
    instance: {
        app: 'topics-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': port,
            '@enabled': 'true',
        },
        vipAddress: 'topics-service',
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
    console.log(`Topics service listening on port ${port}!`);
    client.start((error) => {
        console.log(error || 'Topics service registered with Eureka');
    });
});
