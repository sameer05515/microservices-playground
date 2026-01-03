package com.leetcode;

import java.util.HashMap;
import java.util.Map;

/**
 * LeetCode Problem: Longest Substring Without Repeating Characters
 * 
 * Given a string s, find the length of the longest substring without repeating characters.
 * 
 * Time Complexity: O(n) where n is the length of the string
 * Space Complexity: O(min(m, n)) where m is the size of the charset
 * 
 * Solution: Uses sliding window technique with HashMap to track character indices
 */
public class LengthOfLongestSubstring {
    
    /**
     * Finds the length of the longest substring without repeating characters.
     * Uses sliding window approach with HashMap.
     * 
     * @param s Input string
     * @return Length of the longest substring without repeating characters
     */
    public static int lengthOfLongestSubstring(String s) {
        if (s == null || s.length() == 0) {
            return 0;
        }
        
        // HashMap to store the last index where each character was seen
        Map<Character, Integer> charIndexMap = new HashMap<>();
        int maxLength = 0;
        int left = 0; // Left pointer of the sliding window
        
        // Iterate through the string with right pointer
        for (int right = 0; right < s.length(); right++) {
            char currentChar = s.charAt(right);
            
            // If character was seen before and is within the current window
            if (charIndexMap.containsKey(currentChar) && charIndexMap.get(currentChar) >= left) {
                // Move left pointer to the position after the last occurrence of current character
                left = charIndexMap.get(currentChar) + 1;
            }
            
            // Update the last seen index of current character
            charIndexMap.put(currentChar, right);
            
            // Update maximum length
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Alternative implementation using HashSet (space-efficient but slightly less optimal)
     * This version actually uses sliding window with HashSet to check for duplicates.
     * 
     * @param s Input string
     * @return Length of the longest substring without repeating characters
     */
    public static int lengthOfLongestSubstringHashSet(String s) {
        if (s == null || s.length() == 0) {
            return 0;
        }
        
        java.util.Set<Character> charSet = new java.util.HashSet<>();
        int maxLength = 0;
        int left = 0;
        
        for (int right = 0; right < s.length(); right++) {
            char currentChar = s.charAt(right);
            
            // Remove characters from the left until no duplicate
            while (charSet.contains(currentChar)) {
                charSet.remove(s.charAt(left));
                left++;
            }
            
            // Add current character to the set
            charSet.add(currentChar);
            
            // Update maximum length
            maxLength = Math.max(maxLength, right - left + 1);
        }
        
        return maxLength;
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        String s1 = "abcabcbb";
        int result1 = lengthOfLongestSubstring(s1);
        System.out.println("Example 1:");
        System.out.println("Input: s = \"" + s1 + "\"");
        System.out.println("Output: " + result1);
        System.out.println("Explanation: The answer is \"abc\", with the length of 3.");
        System.out.println();
        
        // Test Case 2: Example 2
        String s2 = "bbbbb";
        int result2 = lengthOfLongestSubstring(s2);
        System.out.println("Example 2:");
        System.out.println("Input: s = \"" + s2 + "\"");
        System.out.println("Output: " + result2);
        System.out.println("Explanation: The answer is \"b\", with the length of 1.");
        System.out.println();
        
        // Test Case 3: Example 3
        String s3 = "pwwkew";
        int result3 = lengthOfLongestSubstring(s3);
        System.out.println("Example 3:");
        System.out.println("Input: s = \"" + s3 + "\"");
        System.out.println("Output: " + result3);
        System.out.println("Explanation: The answer is \"wke\", with the length of 3.");
        System.out.println();
        
        // Additional test cases
        String s4 = "";
        int result4 = lengthOfLongestSubstring(s4);
        System.out.println("Empty string:");
        System.out.println("Input: s = \"" + s4 + "\"");
        System.out.println("Output: " + result4);
        System.out.println();
        
        String s5 = "dvdf";
        int result5 = lengthOfLongestSubstring(s5);
        System.out.println("Additional test:");
        System.out.println("Input: s = \"" + s5 + "\"");
        System.out.println("Output: " + result5);
        System.out.println("Explanation: The answer is \"vdf\", with the length of 3.");
        System.out.println();
        
        String s6 = " ";
        int result6 = lengthOfLongestSubstring(s6);
        System.out.println("Single space:");
        System.out.println("Input: s = \" \"");
        System.out.println("Output: " + result6);
        System.out.println();
        
        String s7 = "abba";
        int result7 = lengthOfLongestSubstring(s7);
        System.out.println("Overlapping pattern:");
        System.out.println("Input: s = \"" + s7 + "\"");
        System.out.println("Output: " + result7);
        System.out.println("Explanation: The answer is \"ab\" or \"ba\", with the length of 2.");
    }
}
