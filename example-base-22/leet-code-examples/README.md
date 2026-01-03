# LeetCode Examples - Maven Project

This Maven project contains solutions to various LeetCode problems implemented in Java.

## Project Structure

```
leet-code-examples/
├── pom.xml
├── README.md
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/
│   │           └── leetcode/
│   │               ├── ListNode.java
│   │               ├── TwoSum.java
│   │               ├── AddTwoNumbers.java
│   │               ├── LengthOfLongestSubstring.java
│   │               ├── MedianOfTwoSortedArrays.java
│   │               ├── ZigzagConversion.java
│   │               ├── ReverseInteger.java
│   │               ├── RegularExpressionMatching.java
│   │               └── ContainerWithMostWater.java
│   └── test/
│       └── java/
│           └── com/
│               └── leetcode/
│                   ├── TwoSumTest.java
│                   ├── AddTwoNumbersTest.java
│                   ├── LengthOfLongestSubstringTest.java
│                   ├── MedianOfTwoSortedArraysTest.java
│                   ├── ZigzagConversionTest.java
│                   ├── ReverseIntegerTest.java
│                   ├── RegularExpressionMatchingTest.java
│                   └── ContainerWithMostWaterTest.java
```

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Building the Project

To compile the project:
```bash
mvn clean compile
```

To compile and run tests:
```bash
mvn test
```

To build the JAR file:
```bash
mvn clean package
```

## Running the Application

### Option 1: Using Maven Exec Plugin
```bash
mvn exec:java
```

### Option 2: Running the compiled JAR
After building the project:
```bash
java -jar target/leet-code-examples-1.0.0.jar
```

### Option 3: Running from compiled classes
```bash
mvn compile
java -cp target/classes com.leetcode.TwoSum
```

## Running Tests

Run all tests:
```bash
mvn test
```

Run tests with verbose output:
```bash
mvn test -X
```

## Problems Solved

### Two Sum
- **Problem**: Find two numbers in an array that add up to a target value
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)
- **Solution**: Uses HashMap for efficient lookup

### Add Two Numbers
- **Problem**: Add two numbers represented as linked lists (digits in reverse order)
- **Time Complexity**: O(max(m, n)) where m and n are the lengths of the two linked lists
- **Space Complexity**: O(max(m, n)) for the result linked list
- **Solution**: Iterate through both lists, handle carry-over digit by digit

### Longest Substring Without Repeating Characters
- **Problem**: Find the length of the longest substring without repeating characters
- **Time Complexity**: O(n) where n is the length of the string
- **Space Complexity**: O(min(m, n)) where m is the size of the charset
- **Solution**: Uses sliding window technique with HashMap to track character indices

### Median of Two Sorted Arrays
- **Problem**: Find the median of two sorted arrays
- **Time Complexity**: O(log(min(m, n))) where m and n are the lengths of the arrays
- **Space Complexity**: O(1)
- **Solution**: Uses binary search to partition both arrays without merging them

### Zigzag Conversion
- **Problem**: Convert a string into a zigzag pattern and return it read line by line
- **Time Complexity**: O(n) where n is the length of the string
- **Space Complexity**: O(n) for storing the result
- **Solution**: Uses array of StringBuilder to simulate the zigzag pattern row by row

### Reverse Integer
- **Problem**: Reverse the digits of a signed 32-bit integer with overflow protection
- **Time Complexity**: O(log(x)) where x is the input number (number of digits)
- **Space Complexity**: O(1)
- **Solution**: Extract digits one by one and reverse, checking for overflow before multiplication

### Regular Expression Matching
- **Problem**: Implement regular expression matching with support for '.' and '*'
- **Time Complexity**: O(m * n) where m is the length of s and n is the length of p
- **Space Complexity**: O(m * n) for the DP table, can be optimized to O(n)
- **Solution**: Uses dynamic programming with a 2D table to track matching states

### Container With Most Water
- **Problem**: Find two lines that together with the x-axis form a container with the most water
- **Time Complexity**: O(n) where n is the length of the height array
- **Space Complexity**: O(1)
- **Solution**: Uses two-pointer technique starting from both ends, moving the pointer with smaller height

## Adding New Problems

To add a new LeetCode problem:

1. Create a new class in `src/main/java/com/leetcode/`
2. Add a corresponding test class in `src/test/java/com/leetcode/`
3. Update this README with the new problem

## Example: Two Sum

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

**Example 1:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

**Example 2:**
```
Input: nums = [3,2,4], target = 6
Output: [1,2]
```

**Example 3:**
```
Input: nums = [3,3], target = 6
Output: [0,1]
```

## Example: Add Two Numbers

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

**Example 1:**
```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2:**
```
Input: l1 = [0], l2 = [0]
Output: [0]
```

**Example 3:**
```
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
Explanation: 9999999 + 9999 = 10009998
```

### Running AddTwoNumbers

```bash
# Run AddTwoNumbers main method
mvn compile
java -cp target/classes com.leetcode.AddTwoNumbers
```

## Example: Longest Substring Without Repeating Characters

Given a string s, find the length of the longest substring without repeating characters.

**Example 1:**
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

**Example 2:**
```
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

**Example 3:**
```
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

### Running LengthOfLongestSubstring

```bash
# Run LengthOfLongestSubstring main method
mvn compile
java -cp target/classes com.leetcode.LengthOfLongestSubstring
```

## Example: Median of Two Sorted Arrays

Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

**Example 1:**
```
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.
```

**Example 2:**
```
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5
```

### Running MedianOfTwoSortedArrays

```bash
# Run MedianOfTwoSortedArrays main method
mvn compile
java -cp target/classes com.leetcode.MedianOfTwoSortedArrays
```

## Example: Zigzag Conversion

The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows. Write the code that will take a string and make this conversion given a number of rows.

**Example 1:**
```
Input: s = "PAYPALISHIRING", numRows = 3
Output: "PAHNAPLSIIGYIR"
Pattern:
P   A   H   N
A P L S I I G
Y   I   R
```

**Example 2:**
```
Input: s = "PAYPALISHIRING", numRows = 4
Output: "PINALSIGYAHRPI"
Pattern:
P     I    N
A   L S  I G
Y A   H R
P     I
```

**Example 3:**
```
Input: s = "A", numRows = 1
Output: "A"
```

### Running ZigzagConversion

```bash
# Run ZigzagConversion main method
mvn compile
java -cp target/classes com.leetcode.ZigzagConversion
```

## Example: Reverse Integer

Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).

**Example 1:**
```
Input: x = 123
Output: 321
```

**Example 2:**
```
Input: x = -123
Output: -321
```

**Example 3:**
```
Input: x = 120
Output: 21
Explanation: Reversing 120, we get 021 which is 21
```

### Running ReverseInteger

```bash
# Run ReverseInteger main method
mvn compile
java -cp target/classes com.leetcode.ReverseInteger
```

## Example: Regular Expression Matching

Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:
- '.' Matches any single character
- '*' Matches zero or more of the preceding element

The matching should cover the entire input string (not partial).

**Example 1:**
```
Input: s = "aa", p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".
```

**Example 2:**
```
Input: s = "aa", p = "a*"
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. 
Therefore, by repeating 'a' once, it becomes "aa".
```

**Example 3:**
```
Input: s = "ab", p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".
```

### Running RegularExpressionMatching

```bash
# Run RegularExpressionMatching main method
mvn compile
java -cp target/classes com.leetcode.RegularExpressionMatching
```

## Example: Container With Most Water

You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.

**Example 1:**
```
Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The max area is between indices 1 and 8 (heights 8 and 7)
Area = min(8, 7) * (8 - 1) = 7 * 7 = 49
```

**Example 2:**
```
Input: height = [1,1]
Output: 1
Explanation: Area = min(1, 1) * (1 - 0) = 1 * 1 = 1
```

### Running ContainerWithMostWater

```bash
# Run ContainerWithMostWater main method
mvn compile
java -cp target/classes com.leetcode.ContainerWithMostWater
```

## License

This project is for educational purposes.

