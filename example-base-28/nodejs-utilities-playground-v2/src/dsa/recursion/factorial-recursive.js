function factorialRecursive(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error("n must be a non-negative integer");
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}
module.exports = { factorialRecursive };
