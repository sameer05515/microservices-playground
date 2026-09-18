function fibonacci(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error("n must be a non-negative integer");
  if (n <= 1) return n;
  let previous = 0, current = 1;
  for (let i = 2; i <= n; i++) [previous, current] = [current, previous + current];
  return current;
}
function fibonacciSequence(count) {
  if (!Number.isInteger(count) || count < 0) throw new Error("count must be non-negative");
  const result = [];
  let previous = 0, current = 1;
  for (let i = 0; i < count; i++) {
    result.push(previous);
    [previous, current] = [current, previous + current];
  }
  return result;
}
module.exports = { fibonacci, fibonacciSequence };
