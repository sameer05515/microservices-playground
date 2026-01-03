# Node.js Utilities & DSA Interview Playground

A collection of **independent** JavaScript/Node.js programs for coding practice and interview preparation.

Every DSA topic is implemented in its own module. Programs do not depend on one another.

## Requirements

- Node.js 18+ recommended
- npm
- No external dependencies

## Structure

```text
nodejs-utilities-playground/
├── package.json
├── README.md
├── src/
│   ├── arithmetic/
│   ├── palindrome/
│   ├── anagram/
│   ├── fibonacci/
│   ├── prime/
│   ├── factorial/
│   ├── string/
│   ├── array/
│   ├── file/
│   └── dsa/
│       ├── arrays/
│       │   ├── two-sum.js
│       │   ├── move-zeroes.js
│       │   ├── rotate-array.js
│       │   ├── max-subarray.js
│       │   ├── merge-sorted-arrays.js
│       │   └── missing-number.js
│       ├── strings/
│       │   ├── first-non-repeating-character.js
│       │   ├── longest-substring-without-repeating.js
│       │   └── valid-parentheses.js
│       ├── searching/
│       │   ├── linear-search.js
│       │   └── binary-search.js
│       ├── sorting/
│       │   ├── bubble-sort.js
│       │   ├── selection-sort.js
│       │   ├── insertion-sort.js
│       │   └── merge-sort.js
│       ├── linked-list/
│       │   └── linked-list.js
│       ├── stack/
│       │   └── stack.js
│       ├── queue/
│       │   └── queue.js
│       ├── recursion/
│       │   ├── factorial-recursive.js
│       │   └── fibonacci-recursive.js
│       ├── hash-map/
│       │   └── frequency-counter.js
│       └── math/
│           ├── gcd.js
│           └── power-fast.js
│   └── index.js
└── test/
    └── dsa.test.js
```

## DSA Topics

### Arrays

- Two Sum
- Move Zeroes
- Rotate Array
- Maximum Subarray — Kadane's Algorithm
- Merge Two Sorted Arrays
- Missing Number

### Strings

- First Non-Repeating Character
- Longest Substring Without Repeating Characters
- Valid Parentheses

### Searching

- Linear Search
- Binary Search

### Sorting

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort

### Linked List

- Singly Linked List
- Insert
- Delete
- Search
- Reverse

### Stack

- Push
- Pop
- Peek
- isEmpty

### Queue

- Enqueue
- Dequeue
- Peek
- isEmpty

### Recursion

- Recursive Factorial
- Recursive Fibonacci

### Hash Map

- Frequency Counter

### Math / Algorithms

- GCD using Euclidean Algorithm
- Fast Power / Binary Exponentiation

## Run

```bash
npm start
```

## Test

```bash
npm test
```

## Run an individual program

Because programs are independent, each can be imported directly:

```javascript
const { twoSum } = require("./src/dsa/arrays/two-sum");

console.log(twoSum([2, 7, 11, 15], 9));
// [0, 1]
```

Or execute a file after adding a small demo block.

## Complexity

| Topic | Typical Complexity |
|---|---|
| Two Sum | O(n) |
| Move Zeroes | O(n) |
| Rotate Array | O(n) |
| Maximum Subarray | O(n) |
| Binary Search | O(log n) |
| Bubble Sort | O(n²) |
| Selection Sort | O(n²) |
| Insertion Sort | O(n²) |
| Merge Sort | O(n log n) |
| Longest Substring | O(n) |
| Valid Parentheses | O(n) |
| Linked List Reverse | O(n) |
| Stack operations | O(1) |
| Queue operations | O(1) |
| GCD | O(log n) |
| Fast Power | O(log n) |

The code favors clear interview-ready implementations over framework abstractions.
