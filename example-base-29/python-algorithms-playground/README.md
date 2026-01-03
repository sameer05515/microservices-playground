# Python Algorithms Playground

A practical, interview-oriented Python project containing common **DSA and algorithm programs**.

The project is intentionally organized by topic. Each algorithm is implemented independently so that you can open, run, modify, and practice one program at a time.

## Requirements

- Python 3.10+
- No third-party dependencies

Check your Python version:

```bash
python --version
```

## Project Structure

```text
python-algorithms-playground/
├── algorithms/
│   ├── arrays/
│   ├── backtracking/
│   ├── dynamic_programming/
│   ├── graphs/
│   ├── greedy/
│   ├── hashmap/
│   ├── linked_list/
│   ├── math/
│   ├── recursion/
│   ├── searching/
│   ├── sorting/
│   ├── stack_queue/
│   ├── strings/
│   └── trees/
├── tests/
├── README.md
└── requirements.txt
```

## Run an Algorithm

From the project root:

```bash
python -m algorithms.searching.binary_search
python -m algorithms.sorting.quick_sort
python -m algorithms.strings.anagram
python -m algorithms.arrays.two_sum
python -m algorithms.graphs.bfs
```

You can also execute a file directly:

```bash
python algorithms/searching/binary_search.py
```

## Common Algorithms Included

### Searching
- Linear Search
- Binary Search
- Search in Rotated Sorted Array
- First/Last Occurrence
- Two Pointer Search

### Sorting
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Counting Sort

### Strings
- Reverse String
- Palindrome
- Anagram
- Character Frequency
- First Non-Repeating Character
- Longest Common Prefix
- Valid Parentheses
- String Compression

### Arrays
- Two Sum
- Maximum Subarray / Kadane's Algorithm
- Move Zeroes
- Rotate Array
- Remove Duplicates
- Missing Number
- Majority Element
- Merge Sorted Arrays
- Product Except Self
- Best Time to Buy/Sell Stock
- Subarray With Given Sum

### Math
- Factorial
- Fibonacci
- Prime Check
- Sieve of Eratosthenes
- GCD / LCM
- Power
- Armstrong Number
- Palindrome Number
- Reverse Number

### Recursion
- Recursive Factorial
- Recursive Fibonacci
- Sum of Digits
- Reverse String
- Generate Subsequences

### Linked List
- Singly Linked List
- Reverse Linked List
- Find Middle Node
- Detect Cycle
- Merge Two Sorted Lists
- Remove Nth Node From End

### Stack / Queue
- Stack Using List
- Queue Using Deque
- Min Stack
- Valid Parentheses
- Next Greater Element
- Sliding Window Maximum

### HashMap / Hashing
- Frequency Counter
- Two Sum
- Group Anagrams
- Longest Consecutive Sequence
- Subarray Sum Equals K

### Trees
- Binary Tree Traversals
- Maximum Depth
- Level Order Traversal
- Validate BST
- Lowest Common Ancestor
- Search in BST

### Graphs
- BFS
- DFS
- Number of Islands
- Detect Cycle in Undirected Graph
- Topological Sort
- Shortest Path in Unweighted Graph
- Dijkstra's Algorithm

### Dynamic Programming
- Climbing Stairs
- Fibonacci DP
- House Robber
- Coin Change
- 0/1 Knapsack
- Longest Common Subsequence
- Longest Increasing Subsequence
- Maximum Subarray

### Greedy
- Activity Selection
- Fractional Knapsack
- Jump Game
- Gas Station

### Backtracking
- Subsets
- Permutations
- Combination Sum
- N-Queens
- Rat in a Maze

## Complexity Cheat Sheet

| Algorithm | Average Time | Worst Time | Space |
|---|---:|---:|---:|
| Linear Search | O(n) | O(n) | O(1) |
| Binary Search | O(log n) | O(log n) | O(1) |
| Bubble Sort | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n²) | O(log n)* |
| Heap Sort | O(n log n) | O(n log n) | O(1) |
| HashMap Lookup | O(1) avg. | O(n) | O(n) |
| BFS | O(V + E) | O(V + E) | O(V) |
| DFS | O(V + E) | O(V + E) | O(V) |
| Dijkstra | O((V+E) log V) | O((V+E) log V) | O(V) |
| LCS DP | O(mn) | O(mn) | O(mn) |
| 0/1 Knapsack | O(nW) | O(nW) | O(nW) |

`*` Quick Sort stack space depends on partition balance.

## Interview Practice Order

A useful progression:

```text
1. Arrays
2. Strings
3. HashMap / Hashing
4. Searching
5. Sorting
6. Stack / Queue
7. Linked List
8. Recursion
9. Trees
10. Graphs
11. Greedy
12. Backtracking
13. Dynamic Programming
```

## How to Practice

For each program:

1. Read the problem statement.
2. Try solving it without looking at the implementation.
3. Write a brute-force solution.
4. Identify the bottleneck.
5. Improve the time complexity.
6. Compare your solution with the implementation.
7. Add your own test cases.
8. Explain the solution aloud as if answering an interview question.

## Running Tests

If `pytest` is installed:

```bash
pytest
```

The algorithm modules themselves use only the Python standard library.

## Interview Questions to Ask Yourself

For every algorithm, be able to answer:

- What problem does it solve?
- What is the brute-force approach?
- What is the optimized approach?
- What is the time complexity?
- What is the space complexity?
- Is the algorithm stable?
- Is it in-place?
- What are the edge cases?
- Can the algorithm be implemented iteratively?
- Can it be implemented recursively?
- When would you choose this algorithm in a real application?

## Goal

This is designed as a **hands-on Python DSA revision repository**, especially useful for Java developers who want to strengthen Python syntax while practicing common interview algorithms.
