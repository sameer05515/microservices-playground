const arithmetic = require("./arithmetic/arithmetic");
const palindrome = require("./palindrome/palindrome");
const anagram = require("./anagram/anagram");
const fibonacci = require("./fibonacci/fibonacci");
const prime = require("./prime/prime");
const factorial = require("./factorial/factorial");
const stringUtils = require("./string/string-utils");
const arrayUtils = require("./array/array-utils");

console.log("================================");
console.log(" Node.js Utilities Playground");
console.log("================================\n");

console.log("ARITHMETIC");
console.log("10 + 5 =", arithmetic.add(10, 5));
console.log("10 - 5 =", arithmetic.subtract(10, 5));
console.log("10 * 5 =", arithmetic.multiply(10, 5));
console.log("10 / 5 =", arithmetic.divide(10, 5));

console.log("\nPALINDROME");
console.log('"Madam" =', palindrome.isPalindrome("Madam"));

console.log("\nANAGRAM");
console.log('"listen" / "silent" =',
  anagram.isAnagramByFrequency("listen", "silent"));

console.log("\nFIBONACCI");
console.log("Fibonacci(10) =", fibonacci.fibonacci(10));
console.log("Sequence =", fibonacci.fibonacciSequence(10));

console.log("\nPRIME");
console.log("Is 29 prime? =", prime.isPrime(29));
console.log("Primes <= 30 =", prime.primesUpTo(30));

console.log("\nFACTORIAL");
console.log("10! =", factorial.factorial(10).toString());

console.log("\nSTRING UTILITIES");
console.log("Reverse =", stringUtils.reverse("Node.js"));
console.log("Words =", stringUtils.countWords("Node.js utilities playground"));
console.log("Capitalize =", stringUtils.capitalizeWords("hello node js"));

console.log("\nARRAY UTILITIES");
const numbers = [5, 2, 8, 2, 10, 5];
console.log("Numbers =", numbers);
console.log("Sum =", arrayUtils.sum(numbers));
console.log("Average =", arrayUtils.average(numbers));
console.log("Second largest =", arrayUtils.secondLargest(numbers));
console.log("Unique =", arrayUtils.removeDuplicates(numbers));
console.log("Sorted =", arrayUtils.sortAscending(numbers));
