function sum(numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}

function average(numbers) {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

function max(numbers) {
  if (numbers.length === 0) return undefined;
  return Math.max(...numbers);
}

function min(numbers) {
  if (numbers.length === 0) return undefined;
  return Math.min(...numbers);
}

function removeDuplicates(values) {
  return [...new Set(values)];
}

function chunk(values, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("size must be greater than zero");
  }

  const result = [];
  for (let i = 0; i < values.length; i += size) {
    result.push(values.slice(i, i + size));
  }
  return result;
}

function flatten(values) {
  return values.flat(Infinity);
}

function secondLargest(numbers) {
  const unique = [...new Set(numbers)].sort((a, b) => b - a);
  return unique.length >= 2 ? unique[1] : undefined;
}

function frequencyMap(values) {
  const frequency = new Map();

  for (const value of values) {
    frequency.set(value, (frequency.get(value) || 0) + 1);
  }

  return frequency;
}

function sortAscending(numbers) {
  return [...numbers].sort((a, b) => a - b);
}

module.exports = {
  sum,
  average,
  max,
  min,
  removeDuplicates,
  chunk,
  flatten,
  secondLargest,
  frequencyMap,
  sortAscending
};
