// index.js

const { getAnswer } = require('./utility');

async function main() {
    try {
        const questionText = "What is the capital of India?";
        const answer = await getAnswer(questionText);
        console.log("Answer:", answer);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
