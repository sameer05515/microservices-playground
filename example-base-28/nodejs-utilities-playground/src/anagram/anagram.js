function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isAnagramBySorting(first, second) {
  const a = [...normalize(first)].sort().join("");
  const b = [...normalize(second)].sort().join("");
  return a === b;
}

function isAnagramByFrequency(first, second) {
  const a = normalize(first);
  const b = normalize(second);

  if (a.length !== b.length) return false;

  const frequency = new Map();

  for (const char of a) {
    frequency.set(char, (frequency.get(char) || 0) + 1);
  }

  for (const char of b) {
    const count = frequency.get(char) || 0;
    if (count === 0) return false;
    frequency.set(char, count - 1);
  }

  return true;
}

module.exports = { isAnagramBySorting, isAnagramByFrequency };
