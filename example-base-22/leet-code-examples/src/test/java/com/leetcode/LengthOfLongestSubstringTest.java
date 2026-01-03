package com.leetcode;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for LengthOfLongestSubstring class
 */
class LengthOfLongestSubstringTest {

    @Test
    @DisplayName("Example 1: s = \"abcabcbb\"")
    void testExample1() {
        String s = "abcabcbb";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(3, result);
    }

    @Test
    @DisplayName("Example 2: s = \"bbbbb\"")
    void testExample2() {
        String s = "bbbbb";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(1, result);
    }

    @Test
    @DisplayName("Example 3: s = \"pwwkew\"")
    void testExample3() {
        String s = "pwwkew";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(3, result);
    }

    @Test
    @DisplayName("Empty string")
    void testEmptyString() {
        String s = "";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Single character")
    void testSingleCharacter() {
        String s = "a";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(1, result);
    }

    @Test
    @DisplayName("All unique characters")
    void testAllUniqueCharacters() {
        String s = "abcdef";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(6, result);
    }

    @Test
    @DisplayName("String with spaces")
    void testStringWithSpaces() {
        String s = " ";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(1, result);
    }

    @Test
    @DisplayName("String with multiple spaces")
    void testMultipleSpaces() {
        String s = "   ";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(1, result);
    }

    @Test
    @DisplayName("Test with dvdf pattern")
    void testDvdfPattern() {
        String s = "dvdf";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(3, result);
    }

    @Test
    @DisplayName("Test with abba pattern")
    void testAbbaPattern() {
        String s = "abba";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(2, result);
    }

    @Test
    @DisplayName("Test with digits")
    void testWithDigits() {
        String s = "1234123456";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(6, result); // "123456"
    }

    @Test
    @DisplayName("Test with mixed alphanumeric")
    void testMixedAlphanumeric() {
        String s = "a1b2c3d4e5";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(10, result); // All unique
    }

    @Test
    @DisplayName("Test with special characters")
    void testWithSpecialCharacters() {
        String s = "!@#$%^&*()";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(10, result); // All unique special characters
    }

    @Test
    @DisplayName("Test long string with repeating pattern")
    void testLongStringWithRepeatingPattern() {
        String s = "abcdefghijklmnopqrstuvwxyz" + "abcdefghijklmnopqrstuvwxyz";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(26, result); // Maximum is 26 unique characters
    }

    @Test
    @DisplayName("Test overlapping pattern")
    void testOverlappingPattern() {
        String s = "tmmzuxt";
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(5, result); // "mzuxt"
    }

    @Test
    @DisplayName("Null string")
    void testNullString() {
        String s = null;
        int result = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Verify HashSet implementation gives same result")
    void testHashSetImplementation() {
        String[] testCases = {
            "abcabcbb",
            "bbbbb",
            "pwwkew",
            "dvdf",
            "abba",
            "abcdef"
        };
        
        for (String s : testCases) {
            int result1 = LengthOfLongestSubstring.lengthOfLongestSubstring(s);
            int result2 = LengthOfLongestSubstring.lengthOfLongestSubstringHashSet(s);
            assertEquals(result1, result2, 
                "HashMap and HashSet implementations should give same result for: " + s);
        }
    }
}
