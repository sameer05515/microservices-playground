function linearSearch(numbers, target) {
  for (let i = 0; i < numbers.length; i++) if (numbers[i] === target) return i;
  return -1;
}
module.exports = { linearSearch };
