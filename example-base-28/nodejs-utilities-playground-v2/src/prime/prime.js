function isPrime(number) {
  if (!Number.isInteger(number) || number < 2) return false;
  if (number === 2) return true;
  if (number % 2 === 0) return false;
  for (let i = 3; i * i <= number; i += 2) {
    if (number % i === 0) return false;
  }
  return true;
}
function primesUpTo(limit) {
  const result = [];
  for (let n = 2; n <= limit; n++) if (isPrime(n)) result.push(n);
  return result;
}
module.exports = { isPrime, primesUpTo };
