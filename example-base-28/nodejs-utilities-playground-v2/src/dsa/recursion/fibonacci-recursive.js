function fibonacciRecursive(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error("n must be a non-negative integer");
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}
module.exports = { fibonacciRecursive };
