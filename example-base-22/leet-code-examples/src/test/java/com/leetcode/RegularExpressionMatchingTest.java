package com.leetcode;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for RegularExpressionMatching class
 */
class RegularExpressionMatchingTest {

    @Test
    @DisplayName("Example 1: s = \"aa\", p = \"a\"")
    void testExample1() {
        String s = "aa";
        String p = "a";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertFalse(result);
    }

    @Test
    @DisplayName("Example 2: s = \"aa\", p = \"a*\"")
    void testExample2() {
        String s = "aa";
        String p = "a*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Example 3: s = \"ab\", p = \".*\"")
    void testExample3() {
        String s = "ab";
        String p = ".*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Multiple asterisks: s = \"aab\", p = \"c*a*b\"")
    void testMultipleAsterisks() {
        String s = "aab";
        String p = "c*a*b";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Complex pattern: s = \"mississippi\", p = \"mis*is*p*.\"")
    void testComplexPattern() {
        String s = "mississippi";
        String p = "mis*is*p*.";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertFalse(result);
    }

    @Test
    @DisplayName("Empty string with pattern that can match empty")
    void testEmptyStringWithMatchingPattern() {
        String s = "";
        String p = "a*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Empty string with pattern that cannot match empty")
    void testEmptyStringWithNonMatchingPattern() {
        String s = "";
        String p = "a";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertFalse(result);
    }

    @Test
    @DisplayName("Single character with dot")
    void testSingleCharacterWithDot() {
        String s = "a";
        String p = ".";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Dot asterisk matches everything")
    void testDotAsteriskMatchesEverything() {
        String s = "abcdef";
        String p = ".*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Asterisk matches zero occurrences")
    void testAsteriskMatchesZero() {
        String s = "ab";
        String p = "abc*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result); // "abc*" matches "ab" (c matches zero times)
    }

    @Test
    @DisplayName("Asterisk matches multiple occurrences")
    void testAsteriskMatchesMultiple() {
        String s = "aaaa";
        String p = "a*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Pattern with multiple asterisks and dots")
    void testMultipleAsterisksAndDots() {
        String s = "abc";
        String p = "a.*c";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Pattern doesn't match - different characters")
    void testPatternDoesNotMatch() {
        String s = "ab";
        String p = "ac";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertFalse(result);
    }

    @Test
    @DisplayName("Pattern longer than string")
    void testPatternLongerThanString() {
        String s = "a";
        String p = "ab*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result); // "b*" matches zero times
    }

    @Test
    @DisplayName("String longer than pattern without asterisk")
    void testStringLongerThanPattern() {
        String s = "aa";
        String p = "a";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertFalse(result);
    }

    @Test
    @DisplayName("Empty string and empty pattern")
    void testEmptyStringAndEmptyPattern() {
        String s = "";
        String p = "";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Complex pattern: s = \"aaa\", p = \"a*a\"")
    void testComplexPattern1() {
        String s = "aaa";
        String p = "a*a";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Complex pattern: s = \"aaa\", p = \"ab*a*c*a\"")
    void testComplexPattern2() {
        String s = "aaa";
        String p = "ab*a*c*a";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Pattern: s = \"aa\", p = \"a.*\"")
    void testPatternWithDotAsterisk() {
        String s = "aa";
        String p = "a.*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Pattern: s = \"ab\", p = \".*c\"")
    void testPatternEndingWithCharacter() {
        String s = "ab";
        String p = ".*c";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertFalse(result);
    }

    @Test
    @DisplayName("Verify all implementations give same result")
    void testAllImplementations() {
        String[][] testCases = {
            {"aa", "a"},
            {"aa", "a*"},
            {"ab", ".*"},
            {"aab", "c*a*b"},
            {"mississippi", "mis*is*p*."},
            {"", "a*"},
            {"a", "."},
            {"abcdef", ".*"},
            {"aaa", "a*a"},
            {"ab", "abc*"}
        };
        
        for (String[] testCase : testCases) {
            String s = testCase[0];
            String p = testCase[1];
            
            boolean result1 = RegularExpressionMatching.isMatch(s, p);
            boolean result2 = RegularExpressionMatching.isMatchOptimized(s, p);
            boolean result3 = RegularExpressionMatching.isMatchRecursive(s, p);
            
            assertEquals(result1, result2,
                "DP and optimized implementations should match for s=\"" + s + "\", p=\"" + p + "\"");
            assertEquals(result1, result3,
                "DP and recursive implementations should match for s=\"" + s + "\", p=\"" + p + "\"");
        }
    }

    @Test
    @DisplayName("Edge case: s = \"a\", p = \"ab*\"")
    void testEdgeCase1() {
        String s = "a";
        String p = "ab*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result); // "b*" matches zero times
    }

    @Test
    @DisplayName("Edge case: s = \"a\", p = \".\"")
    void testEdgeCase2() {
        String s = "a";
        String p = ".";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result);
    }

    @Test
    @DisplayName("Edge case: s = \"\", p = \".*\"")
    void testEdgeCase3() {
        String s = "";
        String p = ".*";
        boolean result = RegularExpressionMatching.isMatch(s, p);
        assertTrue(result); // ".*" can match zero characters
    }
}
