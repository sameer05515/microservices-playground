export const camelCaseToTitleCase = (str) => {
    if (!str) return "";
    return str
        // Add a space before each uppercase letter
        .replace(/([A-Z])/g, ' $1')
        // Capitalize the first letter of each word
        .replace(/^./, (firstLetter) => firstLetter.toUpperCase())
        .trim();
}