function generateUniqueString(prefix = "DEFAULT_ID_PREFIX", index = "") {
    const datePart = Date.now().toString(); // Number value of the current date as string
    const randomPart = Math.floor(100 + Math.random() * 900).toString(); // Random number between 100 and 999
    return `${prefix && prefix.trim().length > 0 ? prefix : "DEFAULT_ID_PREFIX"
        }_${datePart}_${randomPart}${index && index !== "" ? `_${index}` : ""}`;
}

module.exports = { generateUniqueString };
