# Anagram Maven Project

Simple Java Maven project to check whether two strings are anagrams.

## Example

```text
listen  -> silent       = true
hello   -> world        = false
Dormitory -> Dirty room = true
```

## Run

```bash
mvn clean compile
```

```bash
java -cp target/classes com.prem.anagram.AnagramChecker
```

## Approach

1. Remove whitespace.
2. Convert both strings to lowercase.
3. Convert strings to character arrays.
4. Sort both arrays.
5. Compare the sorted arrays.

Time complexity: `O(n log n)` due to sorting.
Space complexity: `O(n)` for the character arrays.
