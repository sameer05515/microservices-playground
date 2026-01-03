# Node.js Utilities Playground

A collection of small, independent JavaScript/Node.js programs useful for learning, coding practice, and interview preparation.

## Requirements

- Node.js 18+ recommended
- npm

## Project Structure

```text
nodejs-utilities-playground/
├── package.json
├── README.md
├── src/
│   ├── arithmetic/
│   │   └── arithmetic.js
│   ├── array/
│   │   └── array-utils.js
│   ├── anagram/
│   │   └── anagram.js
│   ├── factorial/
│   │   └── factorial.js
│   ├── fibonacci/
│   │   └── fibonacci.js
│   ├── file/
│   │   └── file-utils.js
│   ├── palindrome/
│   │   └── palindrome.js
│   ├── prime/
│   │   └── prime.js
│   ├── string/
│   │   └── string-utils.js
│   └── index.js
└── test/
    └── utilities.test.js
```

## Utilities Included

### Arithmetic

- add
- subtract
- multiply
- divide
- modulus
- power
- increment
- decrement

### Palindrome

- Check whether a string is a palindrome
- Check whether a number is a palindrome

### Anagram

- Sorting-based anagram check
- Character-frequency-based anagram check

### Fibonacci

- Get Fibonacci number at position `n`
- Generate Fibonacci sequence

### Prime Number

- Check whether a number is prime
- Generate prime numbers up to a limit

### Factorial

- Calculate factorial
- Supports `BigInt` for larger values

### String Utilities

- Reverse string
- Count characters
- Count words
- Capitalize words
- Remove duplicate characters
- Check whether string contains only digits
- Check whether two strings are equal ignoring case

### Array Utilities

- Sum
- Average
- Maximum
- Minimum
- Remove duplicates
- Chunk array
- Flatten array
- Find second largest
- Frequency map
- Sort numbers ascending

### File Utilities

- Read file
- Write file
- Append file
- Check whether file exists
- Get file statistics
- List files in a directory

## Run

```bash
npm start
```

## Run Tests

```bash
npm test
```

No external npm dependencies are required.
