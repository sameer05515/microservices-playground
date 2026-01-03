package com.leetcode;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for ReverseInteger class
 */
class ReverseIntegerTest {

    @Test
    @DisplayName("Example 1: x = 123")
    void testExample1() {
        int x = 123;
        int result = ReverseInteger.reverse(x);
        assertEquals(321, result);
    }

    @Test
    @DisplayName("Example 2: x = -123")
    void testExample2() {
        int x = -123;
        int result = ReverseInteger.reverse(x);
        assertEquals(-321, result);
    }

    @Test
    @DisplayName("Example 3: x = 120")
    void testExample3() {
        int x = 120;
        int result = ReverseInteger.reverse(x);
        assertEquals(21, result);
    }

    @Test
    @DisplayName("Single digit positive")
    void testSingleDigitPositive() {
        int x = 5;
        int result = ReverseInteger.reverse(x);
        assertEquals(5, result);
    }

    @Test
    @DisplayName("Single digit negative")
    void testSingleDigitNegative() {
        int x = -5;
        int result = ReverseInteger.reverse(x);
        assertEquals(-5, result);
    }

    @Test
    @DisplayName("Zero")
    void testZero() {
        int x = 0;
        int result = ReverseInteger.reverse(x);
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Positive overflow - returns 0")
    void testPositiveOverflow() {
        int x = 1534236469; // Reversed: 9646324351 > Integer.MAX_VALUE
        int result = ReverseInteger.reverse(x);
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Negative overflow - returns 0")
    void testNegativeOverflow() {
        int x = -1534236469; // Reversed: -9646324351 < Integer.MIN_VALUE
        int result = ReverseInteger.reverse(x);
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Integer.MAX_VALUE - overflow")
    void testIntegerMaxValue() {
        int x = Integer.MAX_VALUE;
        int result = ReverseInteger.reverse(x);
        assertEquals(0, result); // Reversing causes overflow
    }

    @Test
    @DisplayName("Integer.MIN_VALUE - overflow")
    void testIntegerMinValue() {
        int x = Integer.MIN_VALUE;
        int result = ReverseInteger.reverse(x);
        assertEquals(0, result); // Reversing causes overflow
    }

    @Test
    @DisplayName("Number ending with zeros")
    void testEndingWithZeros() {
        int x = 100000;
        int result = ReverseInteger.reverse(x);
        assertEquals(1, result);
    }

    @Test
    @DisplayName("Large valid positive number")
    void testLargeValidPositive() {
        int x = 2147447412; // Reversed: 2147447412 (same, valid)
        int result = ReverseInteger.reverse(x);
        assertEquals(2147447412, result);
    }

    @Test
    @DisplayName("Large valid negative number")
    void testLargeValidNegative() {
        int x = -2147447412;
        int result = ReverseInteger.reverse(x);
        assertEquals(-2147447412, result);
    }

    @Test
    @DisplayName("Number with leading zeros after reversal")
    void testLeadingZerosAfterReversal() {
        int x = 102030;
        int result = ReverseInteger.reverse(x);
        assertEquals(30201, result);
    }

    @Test
    @DisplayName("Palindrome number")
    void testPalindrome() {
        int x = 121;
        int result = ReverseInteger.reverse(x);
        assertEquals(121, result);
    }

    @Test
    @DisplayName("Negative palindrome")
    void testNegativePalindrome() {
        int x = -121;
        int result = ReverseInteger.reverse(x);
        assertEquals(-121, result);
    }

    @Test
    @DisplayName("Large number just below overflow")
    void testJustBelowOverflow() {
        // 1463847412 reversed is 2147483641, which would overflow
        // But let's test a number that doesn't overflow
        int x = 1463847412;
        int result = ReverseInteger.reverse(x);
        // Should return 0 because 2147483641 > Integer.MAX_VALUE (2147483647)
        assertEquals(0, result);
    }

    @Test
    @DisplayName("Test at boundary - 2147483647 (MAX_VALUE)")
    void testAtMaxBoundary() {
        int x = 746384741; // Reverses to 147483647, which is valid
        int result = ReverseInteger.reverse(x);
        assertEquals(147483647, result);
    }

    @Test
    @DisplayName("Test at boundary - -2147483648 (MIN_VALUE)")
    void testAtMinBoundary() {
        int x = -846384741; // Reverses to -147483648, which is valid
        int result = ReverseInteger.reverse(x);
        assertEquals(-147483648, result);
    }

    @Test
    @DisplayName("Verify both implementations give same result for valid cases")
    void testBothImplementations() {
        int[] testCases = {
            123,
            -123,
            120,
            0,
            5,
            -5,
            100000,
            2147447412,
            -2147447412
        };
        
        for (int x : testCases) {
            int result1 = ReverseInteger.reverse(x);
            int result2 = ReverseInteger.reverseString(x);
            
            assertEquals(result1, result2,
                "Both implementations should give same result for x=" + x);
        }
    }

    @Test
    @DisplayName("Reversing preserves sign")
    void testSignPreservation() {
        int positive = 456;
        int negative = -456;
        
        assertTrue(ReverseInteger.reverse(positive) > 0);
        assertTrue(ReverseInteger.reverse(negative) < 0);
    }

    @Test
    @DisplayName("Special case: 10")
    void testTen() {
        int x = 10;
        int result = ReverseInteger.reverse(x);
        assertEquals(1, result);
    }

    @Test
    @DisplayName("Special case: -10")
    void testNegativeTen() {
        int x = -10;
        int result = ReverseInteger.reverse(x);
        assertEquals(-1, result);
    }
}
