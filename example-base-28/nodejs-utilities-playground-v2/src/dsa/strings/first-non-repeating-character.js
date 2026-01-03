function firstNonRepeatingCharacter(value) {
  const frequency = new Map();
  for (const char of value) frequency.set(char, (frequency.get(char) || 0) + 1);
  for (const char of value) if (frequency.get(char) === 1) return char;
  return null;
}
module.exports = { firstNonRepeatingCharacter };
