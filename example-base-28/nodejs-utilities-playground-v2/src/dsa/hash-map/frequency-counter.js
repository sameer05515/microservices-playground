function frequencyCounter(values) {
  const frequency = new Map();
  for (const value of values) frequency.set(value, (frequency.get(value) || 0) + 1);
  return frequency;
}
module.exports = { frequencyCounter };
