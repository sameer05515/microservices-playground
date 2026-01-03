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
// Punctuation variants (utterances are lowercased before process)
nlpManager.addDocument('en', 'What is the capital of @country?', 'getCapital');
nlpManager.addDocument('en', 'Tell me the capital of @country?', 'getCapital');

nlpManager.addNamedEntityText('country', 'USA', ['en'], ['usa', 'america']);
nlpManager.addNamedEntityText('country', 'United Kingdom', ['en'], ['uk', 'united kingdom']);
nlpManager.addNamedEntityText('country', 'France', ['en'], ['france']);
nlpManager.addNamedEntityText('country', 'Germany', ['en'], ['germany']);
nlpManager.addNamedEntityText('country', 'India', ['en'], ['india']);
nlpManager.addNamedEntityText('country', 'Pakistan', ['en'], ['pakistan']);
nlpManager.addNamedEntityText('country', 'Canada', ['en'], ['canada']);
nlpManager.addNamedEntityText('country', 'Australia', ['en'], ['australia']);
nlpManager.addNamedEntityText('country', 'Brazil', ['en'], ['brazil']);
nlpManager.addNamedEntityText('country', 'China', ['en'], ['china']);
nlpManager.addNamedEntityText('country', 'Egypt', ['en'], ['egypt']);
nlpManager.addNamedEntityText('country', 'Mexico', ['en'], ['mexico']);
nlpManager.addNamedEntityText('country', 'Russia', ['en'], ['russia']);
nlpManager.addNamedEntityText('country', 'South Africa', ['en'], ['south africa']);
nlpManager.addNamedEntityText('country', 'South Korea', ['en'], ['south korea']);

/** Training is async; await this before `process` or early requests get intent None. */
const nlpTraining = Promise.resolve(nlpManager.train());

/** Keys used in CAPITAL_BY_COUNTRY (after alias resolution). */
const COUNTRY_ALIASES = {
    uk: 'united kingdom',
    america: 'usa',
    'united states': 'usa',
};

/**
 * Phrase → canonical key for CAPITAL_BY_COUNTRY.
 * Longer phrases first so "united kingdom" wins over "uk".
 */
const COUNTRY_PHRASES = [
    ['united kingdom', 'united kingdom'],
    ['united states of america', 'usa'],
    ['united states', 'usa'],
    ['america', 'usa'],
    ['india', 'india'],
    ['pakistan', 'pakistan'],
    ['france', 'france'],
    ['germany', 'germany'],
    ['usa', 'usa'],
    ['uk', 'united kingdom'],
];

/**
 * node-nlp often returns intent but empty `entities` for addNamedEntityText;
 * fall back to matching known country phrases in the utterance.
 */
function extractCountryFromUtterance(text) {
    const lower = text.toLowerCase();
    for (const [phrase, key] of COUNTRY_PHRASES) {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
        const re = new RegExp(`\\b${escaped}\\b`, 'i');
        if (re.test(lower)) return key;
    }
    return undefined;
}

function resolveCountryKey(questionText, response) {
    const entities = Array.isArray(response.entities) ? response.entities : [];
    const countryEntity = entities.find((e) => e.entity === 'country');
    let raw = countryEntity?.option;
    if (raw != null && raw !== '') {
        let key = String(raw).toLowerCase().trim();
        return COUNTRY_ALIASES[key] || key;
    }
    return extractCountryFromUtterance(questionText);
}

function inferIntentFromText(questionText, country, classifiedIntent) {
    const intent = classifiedIntent;
    const unknown = !intent || intent === 'None' || intent === 'none';
    if (!unknown) return intent;
    if (!country) return intent;
    return /\bcapital\b/i.test(questionText) ? 'getCapital' : 'getCountry';
}

const doNaturalLP = async (questionText) => {
    if (!questionText) {
        throw new Error('Empty text. Nothing to process!');
    }

    await nlpTraining;

    console.log(`questionText : ${questionText}`);
    const response = await nlpManager.process('en', questionText.toLowerCase());
    console.log(`response : ${JSON.stringify(response, null, 2)}`);
    const country = resolveCountryKey(questionText, response);
    const intent = inferIntentFromText(questionText, country, response.intent);

    let answer = '';
    switch (intent) {
        case 'getCapital':
            answer = await getCapitalOfCountry(country);
            break;
        case 'getCountry':
            answer = country ? `You mentioned ${country}.` : 'Which country are you asking about?';
            break;
        default:
            answer = 'I am not sure how to answer that.';
            break;
    }

    // Capitalize the response text
    const capitalizedAnswer = conversationUtil.capitalizedText(answer);

    return capitalizedAnswer;
};

/** Hardcoded capitals for trained country entities (see addNamedEntityText). */
const CAPITAL_BY_COUNTRY = {
    usa: 'Washington, D.C.',
    'united kingdom': 'London',
    france: 'Paris',
    germany: 'Berlin',
    india: 'New Delhi',
    pakistan: 'Islamabad',
};

async function getCapitalOfCountry(country) {
    console.log(`country : ${country}`);
    if (!country) {
        return 'Which country do you mean?';
    }
    const key = String(country).toLowerCase();
    return (
        CAPITAL_BY_COUNTRY[key] ?? `Capital not found for the specified country: ${country}`
    );
}

module.exports = {
    doNaturalLP
};
