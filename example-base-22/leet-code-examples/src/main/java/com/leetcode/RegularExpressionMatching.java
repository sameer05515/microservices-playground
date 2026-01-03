package com.leetcode;

/**
 * LeetCode Problem: Regular Expression Matching
 * 
 * Given an input string s and a pattern p, implement regular expression matching
 * with support for '.' and '*' where:
 * - '.' Matches any single character
 * - '*' Matches zero or more of the preceding element
 * 
 * The matching should cover the entire input string (not partial).
 * 
 * Time Complexity: O(m * n) where m is the length of s and n is the length of p
 * Space Complexity: O(m * n) for the DP table, can be optimized to O(n)
 * 
 * Solution: Uses dynamic programming with a 2D table
 */
public class RegularExpressionMatching {
    
    /**
     * Determines if the input string matches the pattern using dynamic programming.
     * 
     * @param s Input string
     * @param p Pattern string (may contain '.' and '*')
     * @return true if s matches p, false otherwise
     */
    public static boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        
        // dp[i][j] = true if s[0..i-1] matches p[0..j-1]
        boolean[][] dp = new boolean[m + 1][n + 1];
        
        // Base case: empty string matches empty pattern
        dp[0][0] = true;
        
        // Handle patterns like "a*b*c*" that can match empty string
        for (int j = 2; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 2]; // '*' can match zero preceding elements
            }
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char sChar = s.charAt(i - 1);
                char pChar = p.charAt(j - 1);
                
                if (pChar == '*') {
                    // '*' matches zero or more of the preceding element
                    char prevChar = p.charAt(j - 2);
                    
                    // Option 1: Match zero times (skip the preceding element)
                    dp[i][j] = dp[i][j - 2];
                    
                    // Option 2: Match one or more times
                    // Check if current character matches the preceding pattern character
                    if (!dp[i][j] && (prevChar == sChar || prevChar == '.')) {
                        dp[i][j] = dp[i - 1][j];
                    }
                } else if (pChar == '.' || pChar == sChar) {
                    // '.' matches any character, or characters match exactly
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    // Characters don't match
                    dp[i][j] = false;
                }
            }
        }
        
        return dp[m][n];
    }
    
    /**
     * Space-optimized version using only O(n) space.
     * Uses two arrays instead of a 2D table.
     * 
     * @param s Input string
     * @param p Pattern string
     * @return true if s matches p, false otherwise
     */
    public static boolean isMatchOptimized(String s, String p) {
        int m = s.length();
        int n = p.length();
        
        // Use two arrays: prev and curr
        boolean[] prev = new boolean[n + 1];
        boolean[] curr = new boolean[n + 1];
        
        // Base case: empty string matches empty pattern
        prev[0] = true;
        
        // Handle patterns like "a*b*c*" that can match empty string
        for (int j = 2; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                prev[j] = prev[j - 2];
            }
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            curr[0] = false; // Non-empty string doesn't match empty pattern
            
            for (int j = 1; j <= n; j++) {
                char sChar = s.charAt(i - 1);
                char pChar = p.charAt(j - 1);
                
                if (pChar == '*') {
                    char prevChar = p.charAt(j - 2);
                    
                    // Option 1: Match zero times
                    curr[j] = curr[j - 2];
                    
                    // Option 2: Match one or more times
                    if (!curr[j] && (prevChar == sChar || prevChar == '.')) {
                        curr[j] = prev[j];
                    }
                } else if (pChar == '.' || pChar == sChar) {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = false;
                }
            }
            
            // Swap prev and curr for next iteration
            boolean[] temp = prev;
            prev = curr;
            curr = temp;
        }
        
        return prev[n];
    }
    
    /**
     * Recursive solution with memoization (alternative approach).
     * Less space-efficient but easier to understand.
     * 
     * @param s Input string
     * @param p Pattern string
     * @return true if s matches p, false otherwise
     */
    public static boolean isMatchRecursive(String s, String p) {
        return isMatchHelper(s, p, 0, 0, new Boolean[s.length() + 1][p.length() + 1]);
    }
    
    private static boolean isMatchHelper(String s, String p, int i, int j, Boolean[][] memo) {
        // If both reached end, match successful
        if (i == s.length() && j == p.length()) {
            return true;
        }
        
        // If pattern exhausted but string not, no match
        if (j == p.length()) {
            return false;
        }
        
        // Check memo
        if (memo[i][j] != null) {
            return memo[i][j];
        }
        
        boolean result;
        
        // Check if next character in pattern is '*'
        boolean hasAsterisk = j + 1 < p.length() && p.charAt(j + 1) == '*';
        
        if (hasAsterisk) {
            // '*' can match zero or more times
            // Option 1: Match zero times (skip current pattern character and '*')
            result = isMatchHelper(s, p, i, j + 2, memo);
            
            // Option 2: Match one or more times (if current characters match)
            if (!result && i < s.length() && (p.charAt(j) == '.' || p.charAt(j) == s.charAt(i))) {
                result = isMatchHelper(s, p, i + 1, j, memo);
            }
        } else {
            // Regular character or '.'
            if (i < s.length() && (p.charAt(j) == '.' || p.charAt(j) == s.charAt(i))) {
                result = isMatchHelper(s, p, i + 1, j + 1, memo);
            } else {
                result = false;
            }
        }
        
        memo[i][j] = result;
        return result;
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        String s1 = "aa";
        String p1 = "a";
        boolean result1 = isMatch(s1, p1);
        
        System.out.println("Example 1:");
        System.out.println("Input: s = \"" + s1 + "\", p = \"" + p1 + "\"");
        System.out.println("Output: " + result1);
        System.out.println("Explanation: \"a\" does not match the entire string \"aa\".");
        System.out.println();
        
        // Test Case 2: Example 2
        String s2 = "aa";
        String p2 = "a*";
        boolean result2 = isMatch(s2, p2);
        
        System.out.println("Example 2:");
        System.out.println("Input: s = \"" + s2 + "\", p = \"" + p2 + "\"");
        System.out.println("Output: " + result2);
        System.out.println("Explanation: '*' means zero or more of the preceding element, 'a'. " +
                          "Therefore, by repeating 'a' once, it becomes \"aa\".");
        System.out.println();
        
        // Test Case 3: Example 3
        String s3 = "ab";
        String p3 = ".*";
        boolean result3 = isMatch(s3, p3);
        
        System.out.println("Example 3:");
        System.out.println("Input: s = \"" + s3 + "\", p = \"" + p3 + "\"");
        System.out.println("Output: " + result3);
        System.out.println("Explanation: \".*\" means \"zero or more (*) of any character (.)\".");
        System.out.println();
        
        // Additional test case: Multiple asterisks
        String s4 = "aab";
        String p4 = "c*a*b";
        boolean result4 = isMatch(s4, p4);
        
        System.out.println("Multiple asterisks:");
        System.out.println("Input: s = \"" + s4 + "\", p = \"" + p4 + "\"");
        System.out.println("Output: " + result4);
        System.out.println("Explanation: \"c*\" matches zero 'c's, \"a*\" matches two 'a's, 'b' matches 'b'.");
        System.out.println();
        
        // Additional test case: Dot with asterisk
        String s5 = "mississippi";
        String p5 = "mis*is*p*.";
        boolean result5 = isMatch(s5, p5);
        
        System.out.println("Complex pattern:");
        System.out.println("Input: s = \"" + s5 + "\", p = \"" + p5 + "\"");
        System.out.println("Output: " + result5);
        System.out.println();
        
        // Additional test case: Empty string with pattern
        String s6 = "";
        String p6 = "a*";
        boolean result6 = isMatch(s6, p6);
        
        System.out.println("Empty string:");
        System.out.println("Input: s = \"" + s6 + "\", p = \"" + p6 + "\"");
        System.out.println("Output: " + result6);
        System.out.println("Explanation: \"a*\" can match zero 'a's, so it matches empty string.");
        System.out.println();
        
        // Additional test case: Single character with dot
        String s7 = "a";
        String p7 = ".";
        boolean result7 = isMatch(s7, p7);
        
        System.out.println("Single character with dot:");
        System.out.println("Input: s = \"" + s7 + "\", p = \"" + p7 + "\"");
        System.out.println("Output: " + result7);
        System.out.println("Explanation: '.' matches any single character.");
    }
}
