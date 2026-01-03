const test = require("node:test");
const assert = require("node:assert/strict");

const arithmetic = require("../src/arithmetic/arithmetic");
const palindrome = require("../src/palindrome/palindrome");
const anagram = require("../src/anagram/anagram");
const fibonacci = require("../src/fibonacci/fibonacci");
const prime = require("../src/prime/prime");
const factorial = require("../src/factorial/factorial");
const stringUtils = require("../src/string/string-utils");
const arrayUtils = require("../src/array/array-utils");

test("arithmetic operations", () => {
  assert.equal(arithmetic.add(2, 3), 5);
  assert.equal(arithmetic.subtract(5, 2), 3);
  assert.equal(arithmetic.multiply(4, 3), 12);
  assert.equal(arithmetic.divide(10, 2), 5);
  assert.equal(arithmetic.modulus(10, 3), 1);
  assert.equal(arithmetic.power(2, 4), 16);
});

test("palindrome", () => {
  assert.equal(palindrome.isPalindrome("Madam"), true);
  assert.equal(palindrome.isPalindrome("hello"), false);
  assert.equal(palindrome.isNumberPalindrome(121), true);
});

test("anagram", () => {
  assert.equal(anagram.isAnagramBySorting("listen", "silent"), true);
  assert.equal(anagram.isAnagramByFrequency("triangle", "integral"), true);
  assert.equal(anagram.isAnagramByFrequency("hello", "world"), false);
});

test("fibonacci", () => {
  assert.equal(fibonacci.fibonacci(0), 0);
  assert.equal(fibonacci.fibonacci(10), 55);
  assert.deepEqual(fibonacci.fibonacciSequence(6), [0, 1, 1, 2, 3, 5]);
});

test("prime", () => {
  assert.equal(prime.isPrime(2), true);
  assert.equal(prime.isPrime(29), true);
  assert.equal(prime.isPrime(25), false);
  assert.deepEqual(prime.primesUpTo(10), [2, 3, 5, 7]);
});

test("factorial", () => {
  assert.equal(factorial.factorial(0), 1n);
  assert.equal(factorial.factorial(5), 120n);
});

test("string utilities", () => {
  assert.equal(stringUtils.reverse("hello"), "olleh");
  assert.equal(stringUtils.countCharacters("hello"), 5);
  assert.equal(stringUtils.countWords("hello node js"), 3);
  assert.equal(stringUtils.capitalizeWords("hello NODE js"), "Hello Node Js");
  assert.equal(stringUtils.removeDuplicateCharacters("banana"), "ban");
  assert.equal(stringUtils.isDigitsOnly("12345"), true);
  assert.equal(stringUtils.equalsIgnoreCase("HELLO", "hello"), true);
});

test("array utilities", () => {
  const numbers = [5, 2, 8, 2, 10, 5];

  assert.equal(arrayUtils.sum(numbers), 32);
  assert.equal(arrayUtils.average(numbers), 32 / 6);
  assert.equal(arrayUtils.max(numbers), 10);
  assert.equal(arrayUtils.min(numbers), 2);
  assert.deepEqual(arrayUtils.removeDuplicates(numbers), [5, 2, 8, 10]);
  assert.deepEqual(arrayUtils.chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
  assert.deepEqual(arrayUtils.flatten([1, [2, [3, 4]]]), [1, 2, 3, 4]);
  assert.equal(arrayUtils.secondLargest(numbers), 8);
  assert.deepEqual(arrayUtils.sortAscending(numbers), [2, 2, 5, 5, 8, 10]);
});
