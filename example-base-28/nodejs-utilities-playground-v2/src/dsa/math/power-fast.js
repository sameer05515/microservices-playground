function powerFast(base, exponent) {
  if (!Number.isInteger(exponent) || exponent < 0) throw new Error("exponent must be non-negative");
  let result = 1;
  let currentBase = base;
  let currentExponent = exponent;
  while (currentExponent > 0) {
    if (currentExponent % 2 === 1) result *= currentBase;
    currentBase *= currentBase;
    currentExponent = Math.floor(currentExponent / 2);
  }
  return result;
}
module.exports = { powerFast };
