# Java Interview Utilities

A Maven project containing **30 small Java interview utilities**, with separate classes for each problem and multiple approaches where useful.

## Classes

### String / Anagram
1. `SortingAnagramChecker` - sorting approach
2. `HashMapAnagramChecker` - frequency map
3. `FrequencyArrayAnagramChecker` - O(n), fixed ASCII array
4. `PalindromeChecker` - two pointers
5. `StringReverser` - StringBuilder
6. `CharacterFrequencyCounter`
7. `FirstNonRepeatingCharacter`
8. `DuplicateCharactersFinder`
9. `VowelConsonantCounter`
10. `WordCount`
11. `LongestWordFinder`

### Array
12. `ArrayDuplicatesFinder`
13. `SecondLargestFinder`
14. `MissingNumberFinder` - sum + XOR
15. `ArrayRotation` - reversal algorithm
16. `TwoSum` - HashMap
17. `ArrayIntersection`
18. `MaxMinFinder`
19. `BinarySearch`
20. `MergeSortedArrays`
21. `RemoveDuplicatesFromSortedArray`

### Collections / Map
22. `ListDuplicatesFinder`
23. `ListFrequencyCounter`
24. `MapSorter`

### Number
25. `PrimeChecker`
26. `FibonacciGenerator`
27. `FactorialCalculator`
28. `ArmstrongNumberChecker`
29. `PalindromeNumberChecker`
30. `ReverseInteger`

### Stack
31. `BalancedBracketsChecker`

`UtilitiesDemo` exercises the complete set.

## Complexity cheat sheet

| Utility | Time | Space |
|---|---:|---:|
| Anagram - Sorting | O(n log n) | O(n) |
| Anagram - HashMap | O(n) avg | O(k) |
| Anagram - Frequency Array | O(n) | O(1) |
| Palindrome | O(n) | O(n) |
| Character Frequency | O(n) | O(k) |
| First Non-Repeating | O(n) | O(k) |
| Duplicate Characters | O(n) avg | O(k) |
| Two Sum | O(n) avg | O(n) |
| Missing Number - Sum | O(n) | O(1) |
| Missing Number - XOR | O(n) | O(1) |
| Array Rotation | O(n) | O(1) |
| Second Largest | O(n) | O(1) |
| Binary Search | O(log n) | O(1) |
| Merge Sorted Arrays | O(n + m) | O(n + m) |
| Remove Sorted Duplicates | O(n) | O(1) |
| Prime Check | O(sqrt(n)) | O(1) |
| Fibonacci | O(n) | O(n) |
| Factorial | O(n) | O(1) |
| Balanced Brackets | O(n) | O(n) |

## Run

```bash
mvn clean compile
java -cp target/classes com.prem.anagram.UtilitiesDemo
```

## What changed from previous ZIP

The earlier ZIP contained only a subset of the utilities. This rebuilt ZIP contains the complete set listed above and a single demo class covering them.
