function moveZeroes(numbers) {
  const result = [...numbers];
  let insertIndex = 0;
  for (const number of result) {
    if (number !== 0) result[insertIndex++] = number;
  }
  while (insertIndex < result.length) result[insertIndex++] = 0;
  return result;
}
module.exports = { moveZeroes };
