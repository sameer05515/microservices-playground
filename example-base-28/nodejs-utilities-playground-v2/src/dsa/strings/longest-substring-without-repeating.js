function longestSubstringLength(value) {
  const lastSeen = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < value.length; right++) {
    const char = value[right];
    if (lastSeen.has(char) && lastSeen.get(char) >= left) left = lastSeen.get(char) + 1;
    lastSeen.set(char, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
module.exports = { longestSubstringLength };
