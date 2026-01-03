package com.leetcode;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for TwoSum class
 */
class TwoSumTest {

    @Test
    @DisplayName("Example 1: nums = [2,7,11,15], target = 9")
    void testExample1() {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = TwoSum.twoSum(nums, target);
        
        assertEquals(2, result.length);
        assertEquals(0, result[0]);
        assertEquals(1, result[1]);
        assertEquals(target, nums[result[0]] + nums[result[1]]);
    }

    @Test
    @DisplayName("Example 2: nums = [3,2,4], target = 6")
    void testExample2() {
        int[] nums = {3, 2, 4};
        int target = 6;
        int[] result = TwoSum.twoSum(nums, target);
        
        assertEquals(2, result.length);
        assertEquals(1, result[0]);
        assertEquals(2, result[1]);
        assertEquals(target, nums[result[0]] + nums[result[1]]);
    }

    @Test
    @DisplayName("Example 3: nums = [3,3], target = 6")
    void testExample3() {
        int[] nums = {3, 3};
        int target = 6;
        int[] result = TwoSum.twoSum(nums, target);
        
        assertEquals(2, result.length);
        assertEquals(0, result[0]);
        assertEquals(1, result[1]);
        assertEquals(target, nums[result[0]] + nums[result[1]]);
    }

    @Test
    @DisplayName("Test with negative numbers")
    void testWithNegativeNumbers() {
        int[] nums = {-1, -2, -3, -4, -5};
        int target = -8;
        int[] result = TwoSum.twoSum(nums, target);
        
        assertEquals(2, result.length);
        assertEquals(target, nums[result[0]] + nums[result[1]]);
        // Should be indices 2 and 4 (values -3 and -5)
        assertTrue((result[0] == 2 && result[1] == 4) || (result[0] == 4 && result[1] == 2));
    }

    @Test
    @DisplayName("Test with mixed positive and negative numbers")
    void testWithMixedNumbers() {
        int[] nums = {-1, 2, -3, 4, 5};
        int target = 1;
        int[] result = TwoSum.twoSum(nums, target);
        
        assertEquals(2, result.length);
        assertEquals(target, nums[result[0]] + nums[result[1]]);
        // Should find -1 + 2 = 1 (indices 0 and 1)
        assertTrue((result[0] == 0 && result[1] == 1) || (result[0] == 1 && result[1] == 0));
    }

    @Test
    @DisplayName("Test with large array")
    void testWithLargeArray() {
        int[] nums = new int[1000];
        for (int i = 0; i < 1000; i++) {
            nums[i] = i;
        }
        int target = 1997; // 998 + 999
        int[] result = TwoSum.twoSum(nums, target);
        
        assertEquals(2, result.length);
        assertEquals(target, nums[result[0]] + nums[result[1]]);
    }

    @Test
    @DisplayName("Test indices are different (no same element twice)")
    void testIndicesAreDifferent() {
        int[] nums = {3, 2, 4};
        int target = 6;
        int[] result = TwoSum.twoSum(nums, target);
        
        assertNotEquals(result[0], result[1], "Indices must be different");
    }
}

