function mergeSortedArrays(first, second) {
  const result = [];
  let i = 0, j = 0;
  while (i < first.length && j < second.length) {
    if (first[i] <= second[j]) result.push(first[i++]);
    else result.push(second[j++]);
  }
  while (i < first.length) result.push(first[i++]);
  while (j < second.length) result.push(second[j++]);
  return result;
}
module.exports = { mergeSortedArrays };
