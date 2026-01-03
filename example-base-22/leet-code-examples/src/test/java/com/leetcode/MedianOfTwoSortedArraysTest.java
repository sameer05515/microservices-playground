package com.leetcode;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for MedianOfTwoSortedArrays class
 */
class MedianOfTwoSortedArraysTest {

    @Test
    @DisplayName("Example 1: nums1 = [1,3], nums2 = [2]")
    void testExample1() {
        int[] nums1 = {1, 3};
        int[] nums2 = {2};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(2.0, result, 0.00001);
    }

    @Test
    @DisplayName("Example 2: nums1 = [1,2], nums2 = [3,4]")
    void testExample2() {
        int[] nums1 = {1, 2};
        int[] nums2 = {3, 4};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(2.5, result, 0.00001);
    }

    @Test
    @DisplayName("One array is empty")
    void testOneEmptyArray() {
        int[] nums1 = {};
        int[] nums2 = {1};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(1.0, result, 0.00001);
    }

    @Test
    @DisplayName("Both arrays are empty")
    void testBothEmptyArrays() {
        int[] nums1 = {};
        int[] nums2 = {};
        // According to constraints, m + n >= 1, but testing edge case handling
        assertThrows(IllegalArgumentException.class, () -> {
            MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        });
    }

    @Test
    @DisplayName("Single element in both arrays")
    void testSingleElementBoth() {
        int[] nums1 = {1};
        int[] nums2 = {2};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(1.5, result, 0.00001);
    }

    @Test
    @DisplayName("Same elements in both arrays")
    void testSameElements() {
        int[] nums1 = {1, 1};
        int[] nums2 = {1, 1};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(1.0, result, 0.00001);
    }

    @Test
    @DisplayName("One array entirely smaller than the other")
    void testOneArrayEntirelySmaller() {
        int[] nums1 = {1, 2};
        int[] nums2 = {5, 6, 7};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(5.0, result, 0.00001);
    }

    @Test
    @DisplayName("Overlapping ranges")
    void testOverlappingRanges() {
        int[] nums1 = {1, 3, 5};
        int[] nums2 = {2, 4, 6};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(3.5, result, 0.00001);
    }

    @Test
    @DisplayName("One array with single element, other with multiple")
    void testOneSingleElement() {
        int[] nums1 = {1};
        int[] nums2 = {2, 3, 4};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(2.5, result, 0.00001);
    }

    @Test
    @DisplayName("Arrays of different sizes - odd total")
    void testDifferentSizesOddTotal() {
        int[] nums1 = {1, 2, 3};
        int[] nums2 = {4, 5};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(3.0, result, 0.00001);
    }

    @Test
    @DisplayName("Arrays of different sizes - even total")
    void testDifferentSizesEvenTotal() {
        int[] nums1 = {1, 2, 3, 4};
        int[] nums2 = {5, 6};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(3.5, result, 0.00001);
    }

    @Test
    @DisplayName("Negative numbers")
    void testNegativeNumbers() {
        int[] nums1 = {-1, 3};
        int[] nums2 = {-2, 4};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(1.0, result, 0.00001);
    }

    @Test
    @DisplayName("Large numbers")
    void testLargeNumbers() {
        int[] nums1 = {1000000, 2000000};
        int[] nums2 = {3000000};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(2000000.0, result, 0.00001);
    }

    @Test
    @DisplayName("Arrays with duplicates")
    void testArraysWithDuplicates() {
        int[] nums1 = {1, 2, 2};
        int[] nums2 = {2, 3};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(2.0, result, 0.00001);
    }

    @Test
    @DisplayName("First array is larger")
    void testFirstArrayLarger() {
        int[] nums1 = {1, 2, 3, 4, 5};
        int[] nums2 = {6, 7};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(4.0, result, 0.00001);
    }

    @Test
    @DisplayName("Second array is larger")
    void testSecondArrayLarger() {
        int[] nums1 = {1};
        int[] nums2 = {2, 3, 4, 5, 6};
        double result = MedianOfTwoSortedArrays.findMedianSortedArrays(nums1, nums2);
        assertEquals(3.5, result, 0.00001);
    }

    @Test
    @DisplayName("Verify both implementations give same result")
    void testBothImplementations() {
        int[][] testCases1 = {
            {1, 3},
            {1, 2},
            {1, 3, 5},
            {1, 2},
            {1}
        };
        
        int[][] testCases2 = {
            {2},
            {3, 4},
            {2, 4, 6},
            {5, 6, 7},
            {2, 3, 4}
        };
        
        for (int i = 0; i < testCases1.length; i++) {
            double result1 = MedianOfTwoSortedArrays.findMedianSortedArrays(
                testCases1[i], testCases2[i]);
            double result2 = MedianOfTwoSortedArrays.findMedianSortedArraysMerge(
                testCases1[i], testCases2[i]);
            
            assertEquals(result1, result2, 0.00001,
                "Binary search and merge implementations should give same result");
        }
    }
}
