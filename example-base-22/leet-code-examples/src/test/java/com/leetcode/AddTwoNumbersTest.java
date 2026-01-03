package com.leetcode;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for AddTwoNumbers class
 */
class AddTwoNumbersTest {

    @Test
    @DisplayName("Example 1: l1 = [2,4,3], l2 = [5,6,4]")
    void testExample1() {
        ListNode l1 = ListNode.fromArray(new int[]{2, 4, 3});
        ListNode l2 = ListNode.fromArray(new int[]{5, 6, 4});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {7, 0, 8};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Example 2: l1 = [0], l2 = [0]")
    void testExample2() {
        ListNode l1 = ListNode.fromArray(new int[]{0});
        ListNode l2 = ListNode.fromArray(new int[]{0});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {0};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Example 3: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]")
    void testExample3() {
        ListNode l1 = ListNode.fromArray(new int[]{9, 9, 9, 9, 9, 9, 9});
        ListNode l2 = ListNode.fromArray(new int[]{9, 9, 9, 9});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {8, 9, 9, 9, 0, 0, 0, 1};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with carry propagation")
    void testWithCarryPropagation() {
        ListNode l1 = ListNode.fromArray(new int[]{9, 9, 9});
        ListNode l2 = ListNode.fromArray(new int[]{1});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {0, 0, 0, 1};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with different length lists - l1 longer")
    void testDifferentLengthsL1Longer() {
        ListNode l1 = ListNode.fromArray(new int[]{1, 8, 3});
        ListNode l2 = ListNode.fromArray(new int[]{5});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {6, 8, 3};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with different length lists - l2 longer")
    void testDifferentLengthsL2Longer() {
        ListNode l1 = ListNode.fromArray(new int[]{5});
        ListNode l2 = ListNode.fromArray(new int[]{1, 8, 3});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {6, 8, 3};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with single digit addition")
    void testSingleDigitAddition() {
        ListNode l1 = ListNode.fromArray(new int[]{5});
        ListNode l2 = ListNode.fromArray(new int[]{5});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {0, 1};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with multiple carries")
    void testMultipleCarries() {
        ListNode l1 = ListNode.fromArray(new int[]{9, 9, 9, 9});
        ListNode l2 = ListNode.fromArray(new int[]{9, 9, 9, 9});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {8, 9, 9, 9, 1};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with one zero list")
    void testOneZeroList() {
        ListNode l1 = ListNode.fromArray(new int[]{1, 8});
        ListNode l2 = ListNode.fromArray(new int[]{0});
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        int[] expected = {1, 8};
        int[] actual = ListNode.toArray(result);
        
        assertArrayEquals(expected, actual);
    }

    @Test
    @DisplayName("Test with large numbers")
    void testLargeNumbers() {
        int[] largeArray1 = new int[50];
        int[] largeArray2 = new int[50];
        for (int i = 0; i < 50; i++) {
            largeArray1[i] = 9;
            largeArray2[i] = 9;
        }
        
        ListNode l1 = ListNode.fromArray(largeArray1);
        ListNode l2 = ListNode.fromArray(largeArray2);
        ListNode result = AddTwoNumbers.addTwoNumbers(l1, l2);
        
        // Result should have 51 digits with 8s and a final 1
        int[] actual = ListNode.toArray(result);
        assertEquals(51, actual.length);
        assertEquals(1, actual[50]); // Last digit should be 1
        for (int i = 0; i < 50; i++) {
            assertEquals(8, actual[i]); // All other digits should be 8
        }
    }
}
