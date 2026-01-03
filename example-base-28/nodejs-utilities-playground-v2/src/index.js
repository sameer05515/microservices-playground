const { twoSum } = require("./dsa/arrays/two-sum");
const { maxSubarraySum } = require("./dsa/arrays/max-subarray");
const { binarySearch } = require("./dsa/searching/binary-search");
const { mergeSort } = require("./dsa/sorting/merge-sort");
const { longestSubstringLength } = require("./dsa/strings/longest-substring-without-repeating");
const { isValidParentheses } = require("./dsa/strings/valid-parentheses");
const { LinkedList } = require("./dsa/linked-list/linked-list");
const { Stack } = require("./dsa/stack/stack");
const { Queue } = require("./dsa/queue/queue");
const { gcd } = require("./dsa/math/gcd");

console.log("======================================");
console.log(" Node.js Utilities & DSA Playground");
console.log("======================================");

console.log("\nTwo Sum:", twoSum([2, 7, 11, 15], 9));
console.log("Maximum Subarray:", maxSubarraySum([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
console.log("Binary Search:", binarySearch([1, 3, 5, 7, 9], 7));
console.log("Merge Sort:", mergeSort([5, 2, 8, 1, 3]));
console.log("Longest Unique Substring:", longestSubstringLength("abcabcbb"));
console.log("Valid Parentheses:", isValidParentheses("{[()]}"));
console.log("GCD:", gcd(48, 18));

const list = new LinkedList();
list.insertAtEnd(10);
list.insertAtEnd(20);
list.insertAtBeginning(5);
console.log("Linked List:", list.toArray());

const stack = new Stack();
stack.push(10);
stack.push(20);
console.log("Stack peek:", stack.peek());

const queue = new Queue();
queue.enqueue("A");
queue.enqueue("B");
console.log("Queue dequeue:", queue.dequeue());
