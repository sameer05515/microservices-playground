function missingNumber(numbers) {
  const n = numbers.length;
  let result = n;
  for (let i = 0; i < n; i++) result ^= i ^ numbers[i];
  return result;
}
module.exports = { missingNumber };
