const express = require('express');
const { Eureka } = require('eureka-js-client');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.SERVICE_PORT || 3000;

const client = new Eureka({
    instance: {
        app: 'api-gateway',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': port,
            '@enabled': 'true',
        },
        vipAddress: 'api-gateway',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: process.env.EUREKA_SERVER || 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.start((error) => {
    console.log(error || 'API Gateway registered with Eureka');
});

const getServiceUrl = (appName) => {
    const instances = client.getInstancesByAppId(appName);
    if (instances.length > 0) {
        const instance = instances[0];
        return `http://${instance.hostName}:${instance.port.$}`;
    }
    return null;
};

app.use('/topics', (req, res, next) => {
    const serviceUrl = getServiceUrl('topics-service');
    if (serviceUrl) {
        createProxyMiddleware({
            target: serviceUrl,
            changeOrigin: true,
        })(req, res, next);
    } else {
        res.status(502).send('Service Unavailable');
    }
});

app.use('/words', (req, res, next) => {
    const serviceUrl = getServiceUrl('words-service');
    if (serviceUrl) {
        createProxyMiddleware({
            target: serviceUrl,
            changeOrigin: true,
        })(req, res, next);
    } else {
        res.status(502).send('Service Unavailable');
    }
});

app.listen(port, () => {
    console.log(`API Gateway listening on port ${port}!`);
});
