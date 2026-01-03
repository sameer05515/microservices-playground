const test = require("node:test");
const assert = require("node:assert/strict");

const { twoSum } = require("../src/dsa/arrays/two-sum");
const { moveZeroes } = require("../src/dsa/arrays/move-zeroes");
const { rotateArray } = require("../src/dsa/arrays/rotate-array");
const { maxSubarraySum } = require("../src/dsa/arrays/max-subarray");
const { mergeSortedArrays } = require("../src/dsa/arrays/merge-sorted-arrays");
const { missingNumber } = require("../src/dsa/arrays/missing-number");
const { firstNonRepeatingCharacter } = require("../src/dsa/strings/first-non-repeating-character");
const { longestSubstringLength } = require("../src/dsa/strings/longest-substring-without-repeating");
const { isValidParentheses } = require("../src/dsa/strings/valid-parentheses");
const { linearSearch } = require("../src/dsa/searching/linear-search");
const { binarySearch } = require("../src/dsa/searching/binary-search");
const { bubbleSort } = require("../src/dsa/sorting/bubble-sort");
const { selectionSort } = require("../src/dsa/sorting/selection-sort");
const { insertionSort } = require("../src/dsa/sorting/insertion-sort");
const { mergeSort } = require("../src/dsa/sorting/merge-sort");
const { LinkedList } = require("../src/dsa/linked-list/linked-list");
const { Stack } = require("../src/dsa/stack/stack");
const { Queue } = require("../src/dsa/queue/queue");
const { factorialRecursive } = require("../src/dsa/recursion/factorial-recursive");
const { fibonacciRecursive } = require("../src/dsa/recursion/fibonacci-recursive");
const { frequencyCounter } = require("../src/dsa/hash-map/frequency-counter");
const { gcd } = require("../src/dsa/math/gcd");
const { powerFast } = require("../src/dsa/math/power-fast");

test("Two Sum", () => assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]));
test("Move Zeroes", () => assert.deepEqual(moveZeroes([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0]));
test("Rotate Array", () => assert.deepEqual(rotateArray([1, 2, 3, 4, 5], 2), [4, 5, 1, 2, 3]));
test("Maximum Subarray", () => assert.equal(maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6));
test("Merge Sorted Arrays", () => assert.deepEqual(mergeSortedArrays([1, 3, 5], [2, 4, 6]), [1, 2, 3, 4, 5, 6]));
test("Missing Number", () => assert.equal(missingNumber([3, 0, 1]), 2));

test("First Non-Repeating Character", () => assert.equal(firstNonRepeatingCharacter("swiss"), "w"));
test("Longest Substring", () => assert.equal(longestSubstringLength("abcabcbb"), 3));
test("Valid Parentheses", () => assert.equal(isValidParentheses("{[()]}"), true));

test("Linear Search", () => assert.equal(linearSearch([10, 20, 30], 20), 1));
test("Binary Search", () => assert.equal(binarySearch([10, 20, 30, 40], 30), 2));

test("Bubble Sort", () => assert.deepEqual(bubbleSort([5, 2, 4, 1]), [1, 2, 4, 5]));
test("Selection Sort", () => assert.deepEqual(selectionSort([5, 2, 4, 1]), [1, 2, 4, 5]));
test("Insertion Sort", () => assert.deepEqual(insertionSort([5, 2, 4, 1]), [1, 2, 4, 5]));
test("Merge Sort", () => assert.deepEqual(mergeSort([5, 2, 8, 1, 3]), [1, 2, 3, 5, 8]));

test("Linked List", () => {
  const list = new LinkedList();
  list.insertAtEnd(10);
  list.insertAtEnd(20);
  list.insertAtBeginning(5);
  assert.deepEqual(list.toArray(), [5, 10, 20]);
  assert.equal(list.search(10), true);
  assert.equal(list.delete(10), true);
  assert.deepEqual(list.toArray(), [5, 20]);
  list.reverse();
  assert.deepEqual(list.toArray(), [20, 5]);
});

test("Stack", () => {
  const stack = new Stack();
  stack.push(10);
  stack.push(20);
  assert.equal(stack.peek(), 20);
  assert.equal(stack.pop(), 20);
  assert.equal(stack.size(), 1);
});

test("Queue", () => {
  const queue = new Queue();
  queue.enqueue("A");
  queue.enqueue("B");
  assert.equal(queue.peek(), "A");
  assert.equal(queue.dequeue(), "A");
  assert.equal(queue.dequeue(), "B");
  assert.equal(queue.isEmpty(), true);
});

test("Recursive Factorial", () => assert.equal(factorialRecursive(5), 120));
test("Recursive Fibonacci", () => assert.equal(fibonacciRecursive(10), 55));

test("Frequency Counter", () => {
  const result = frequencyCounter(["a", "b", "a", "c", "a"]);
  assert.equal(result.get("a"), 3);
  assert.equal(result.get("b"), 1);
});

test("GCD", () => assert.equal(gcd(48, 18), 6));
test("Fast Power", () => assert.equal(powerFast(2, 10), 1024));
