function factorial(n) {
  if (!Number.isInteger(n) || n < 0) throw new Error("n must be a non-negative integer");
  let result = 1n;
  for (let i = 2n; i <= BigInt(n); i++) result *= i;
  return result;
}
module.exports = { factorial };
