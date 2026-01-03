function normalize(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}
function isPalindrome(value) {
  const text = normalize(value);
  return text === [...text].reverse().join("");
}
function isNumberPalindrome(number) {
  return Number.isInteger(number) && number >= 0 && isPalindrome(number);
}
module.exports = { isPalindrome, isNumberPalindrome };
