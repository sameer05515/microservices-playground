function rotateArray(numbers, k) {
  const n = numbers.length;
  if (n === 0) return [];
  const shift = ((k % n) + n) % n;
  return numbers.slice(n - shift).concat(numbers.slice(0, n - shift));
}
module.exports = { rotateArray };
