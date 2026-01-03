function binarySearch(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (numbers[mid] === target) return mid;
    if (numbers[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
module.exports = { binarySearch };
