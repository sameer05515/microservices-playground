// utility.js

const { NlpManager } = require('opennlp-node');

async function getAnswer(questionText) {
    const nlpManager = new NlpManager();
    // Add your NLP logic here using OpenNLP
    // For example:
    const answer = await nlpManager.process(questionText);
    return answer;
}

module.exports = {
    getAnswer
};
