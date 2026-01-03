function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return result.concat(left.slice(i), right.slice(j));
}
function mergeSort(numbers) {
  if (numbers.length <= 1) return [...numbers];
  const mid = Math.floor(numbers.length / 2);
  return merge(mergeSort(numbers.slice(0, mid)), mergeSort(numbers.slice(mid)));
}
module.exports = { mergeSort };
