function generateUniqueString(prefix = "DEFAULT_ID_PREFIX", index = "") {
    const datePart = Date.now().toString(); // Number value of the current date as string
    const randomPart = Math.floor(100 + Math.random() * 900).toString(); // Random number between 100 and 999

    const sanitizedPrefix = typeof prefix === 'string' && prefix.trim().length > 0 ? prefix.trim() : "DEFAULT_ID_PREFIX";
    const sanitizedIndex = index !== null && index !== undefined && index !== "" ? `_${index}` : "";

    return `${sanitizedPrefix}_${datePart}_${randomPart}${sanitizedIndex}`;
}

module.exports = { generateUniqueString };
