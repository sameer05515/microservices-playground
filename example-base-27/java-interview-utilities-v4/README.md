# Java Interview Utilities - Complete

A growing Java/Maven interview-practice repository. The project is organized as small, independent utility classes so each algorithm can be studied separately.

## Current categories

### String / Anagram
- SortingAnagramChecker
- HashMapAnagramChecker
- FrequencyArrayAnagramChecker
- PalindromeChecker
- StringReverser
- CharacterFrequencyCounter
- FirstNonRepeatingCharacter
- DuplicateCharactersFinder
- VowelConsonantCounter
- WordCount
- LongestWordFinder

### Array
- ArrayDuplicatesFinder
- SecondLargestFinder
- MissingNumberFinder (Sum + XOR)
- ArrayRotation
- TwoSum
- ArrayIntersection
- MaxMinFinder
- BinarySearch
- MergeSortedArrays
- RemoveDuplicatesFromSortedArray

### Collections / Map
- ListDuplicatesFinder
- ListFrequencyCounter
- MapSorter

### Number
- PrimeChecker
- FibonacciGenerator
- FactorialCalculator
- ArmstrongNumberChecker
- PalindromeNumberChecker
- ReverseInteger

### Stack / Queue
- BalancedBracketsChecker
- StackUsingArray
- QueueUsingArray
- QueueUsingTwoStacks

### LinkedList
- ReverseLinkedList
- FindMiddleLinkedList
- DetectLinkedListCycle
- RemoveNthFromEnd

### Binary Tree / BST
- BinaryTreeTraversals
- BinaryTreeHeight
- BinarySearchTree
- LevelOrderTraversal

### Heap
- MinHeap
- KthLargestElement

### Graph
- BFSGraph
- DFSGraph
- NumberOfIslands

### Recursion / Backtracking
- RecursiveFactorial
- RecursiveFibonacci
- PowerCalculator
- GenerateSubsets

### Dynamic Programming
- ClimbingStairs
- FibonacciDP
- HouseRobber
- LongestCommonSubsequence

### Java 8 Streams
- StreamFrequencyCounter
- StreamFilterSort
- StreamFindMaxMin
- StreamPartitioning

### Multithreading
- CounterWithSynchronized
- ProducerConsumerBlockingQueue
- ExecutorServiceDemo

### Design Patterns
- Singleton
- FactoryPattern
- BuilderPattern
- StrategyPattern

## Complexity quick reference

| Topic | Typical complexity |
|---|---|
| Anagram - Sorting | O(n log n) |
| Anagram - HashMap | O(n) average |
| Anagram - Frequency Array | O(n), O(1) extra space |
| Two Sum | O(n) average |
| Binary Search | O(log n) |
| Array Rotation | O(n), O(1) extra space |
| LinkedList reverse | O(n) |
| LinkedList middle/cycle | O(n), O(1) |
| Tree traversal | O(n) |
| BST search | O(h) |
| Heap add/poll | O(log n) |
| Kth largest with heap | O(n log k) |
| BFS / DFS | O(V + E) |
| Number of Islands | O(rows * cols) |
| LCS | O(n*m) |
| Climbing Stairs | O(n) |
| Stream sorting | O(n log n) |
| Synchronized increment | O(1) per increment |

## Run

```bash
mvn clean compile
java -cp target/classes com.prem.anagram.UtilitiesDemo
```

## What changed from previous version

The previous version contained the core String, Array, Collection and Number utilities.

This version retains them and adds interview-focused sections for:

1. LinkedList
2. Stack / Queue
3. Binary Tree / BST
4. Heap
5. Graph
6. Recursion / Backtracking
7. Dynamic Programming
8. Java 8 Streams
9. Multithreading
10. Design Patterns

The repository now contains **70 Java source classes** including `UtilitiesDemo`.
