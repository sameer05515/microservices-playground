function maxSubarraySum(numbers) {
  if (numbers.length === 0) return 0;
  let current = numbers[0], best = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    current = Math.max(numbers[i], current + numbers[i]);
    best = Math.max(best, current);
  }
  return best;
}
module.exports = { maxSubarraySum };
