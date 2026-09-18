function selectionSort(numbers) {
  const result = [...numbers];
  for (let i = 0; i < result.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < result.length; j++)
      if (result[j] < result[minIndex]) minIndex = j;
    [result[i], result[minIndex]] = [result[minIndex], result[i]];
  }
  return result;
}
module.exports = { selectionSort };
