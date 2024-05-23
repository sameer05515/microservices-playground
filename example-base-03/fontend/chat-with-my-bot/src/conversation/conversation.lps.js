const { NlpManager } = require('node-nlp');
const conversationUtil = require('./conversation.util');

// Create an instance of NlpManager
// const nlpManager = new NlpManager({ languages: ['en'] });

// Create an instance of NlpManager with a custom confidence threshold
const nlpManager = new NlpManager({ languages: ['en'], nlu: { threshold: 0.1 } });


// Add intents and entities to the NlpManager
nlpManager.addDocument('en', 'What is the capital of @country?', 'getCapital');
nlpManager.addDocument('en', 'Tell me the capital of @country', 'getCapital');
nlpManager.addDocument('en', 'What is @country capital?', 'getCapital');
nlpManager.addDocument('en', 'Tell me @country capital', 'getCapital');
nlpManager.addDocument('en', 'What is the capital of @country', 'getCapital');
nlpManager.addDocument('en', 'What is the @country capital', 'getCapital');
nlpManager.addDocument('en', 'Capital of @country', 'getCapital');
nlpManager.addDocument('en', '@country capital', 'getCapital');
nlpManager.addDocument('en', 'What is @country', 'getCountry');

nlpManager.addNamedEntityText('country', 'USA', ['en'], ['usa', 'america']);
nlpManager.addNamedEntityText('country', 'United Kingdom', ['en'], ['uk', 'united kingdom']);
nlpManager.addNamedEntityText('country', 'France', ['en'], ['france']);
nlpManager.addNamedEntityText('country', 'Germany', ['en'], ['germany']);
nlpManager.addNamedEntityText('country', 'India', ['en'], ['india']);

// Train the NlpManager
nlpManager.train();

const doNaturalLP = async (questionText) => {
    if (!questionText) {
        throw new Error('Empty text. Nothing to process!');
    }

    // Process the question using the trained NlpManager
    // Process the question using the trained NlpManager
    console.log(`questionText : ${questionText}`)
    const response = await nlpManager.process('en', questionText.toLowerCase());
    console.log(`response : ${JSON.stringify(response, null, 2)}`)
    const intent = response.intent;
    const countryEntity = response.entities.find(entity => entity.entity === 'country');

    // Extract the country from the entity
    const country = countryEntity ? countryEntity.option : undefined;

    // Generate the response based on the detected intent and entity
    let answer = '';
    switch (intent) {
        case 'getCapital':
            answer = await getCapitalOfCountry(country);
            break;
        case 'getCountry':
            answer = `You mentioned ${country}.`;
            break;
        default:
            answer = 'I am not sure how to answer that.';
            break;
    }

    // Capitalize the response text
    const capitalizedAnswer = conversationUtil.capitalizedText(answer);

    return capitalizedAnswer;
};

// Dummy function to get the capital of a country
async function getCapitalOfCountry(country) {
    // Dummy implementation, you would perform a database query to retrieve the capital of the specified country
    // For demonstration, let's return a hardcoded capital based on the country
    console.log(`country : ${country}`)
    let answer='';
    switch (country?.toLowerCase()) {
        case 'usa':
            answer= 'Washington, D.C.';
        case 'united kingdom':
            answer= 'London';
        case 'france':
            return 'Paris';
        case 'germany':
            answer= 'Berlin';
        case 'india':
            answer= 'New Delhi';
        default:
            answer= `Capital not found for the specified country : `+country;
    }
    return answer;
}

module.exports = {
    doNaturalLP
};
