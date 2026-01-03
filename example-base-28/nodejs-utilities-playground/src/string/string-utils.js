function reverse(value) {
  return [...String(value)].reverse().join("");
}

function countCharacters(value) {
  return [...String(value)].length;
}

function countWords(value) {
  const text = String(value).trim();
  return text ? text.split(/\s+/).length : 0;
}

function capitalizeWords(value) {
  return String(value)
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function removeDuplicateCharacters(value) {
  return [...new Set(String(value))].join("");
}

function isDigitsOnly(value) {
  return /^\d+$/.test(String(value));
}

function equalsIgnoreCase(first, second) {
  return String(first).toLowerCase() === String(second).toLowerCase();
}

module.exports = {
  reverse,
  countCharacters,
  countWords,
  capitalizeWords,
  removeDuplicateCharacters,
  isDigitsOnly,
  equalsIgnoreCase
};
