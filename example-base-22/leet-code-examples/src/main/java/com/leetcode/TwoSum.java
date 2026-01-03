package com.leetcode;

import java.util.HashMap;
import java.util.Map;

/**
 * LeetCode Problem: Two Sum
 * 
 * Given an array of integers nums and an integer target, return indices of the two numbers
 * such that they add up to target.
 * 
 * You may assume that each input would have exactly one solution, and you may not use
 * the same element twice.
 * 
 * You can return the answer in any order.
 * 
 * Time Complexity: O(n) - single pass through the array
 * Space Complexity: O(n) - HashMap to store elements and their indices
 */
public class TwoSum {
    
    /**
     * Finds two numbers in the array that add up to the target.
     * Uses HashMap for O(n) time complexity.
     * 
     * @param nums   Array of integers
     * @param target Target sum
     * @return Array containing the indices of the two numbers
     */
    public static int[] twoSum(int[] nums, int target) {
        // HashMap to store number and its index
        Map<Integer, Integer> map = new HashMap<>();
        
        // Iterate through the array
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            // Check if complement exists in the map
            if (map.containsKey(complement)) {
                // Found the pair - return indices
                return new int[]{map.get(complement), i};
            }
            
            // Store current number and its index in the map
            map.put(nums[i], i);
        }
        
        // This should never be reached given the problem constraints
        // (exactly one solution exists)
        throw new IllegalArgumentException("No two sum solution exists");
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        int[] nums1 = {2, 7, 11, 15};
        int target1 = 9;
        int[] result1 = twoSum(nums1, target1);
        System.out.println("Example 1:");
        System.out.println("Input: nums = [2,7,11,15], target = 9");
        System.out.println("Output: [" + result1[0] + "," + result1[1] + "]");
        System.out.println("Explanation: nums[" + result1[0] + "] + nums[" + result1[1] + 
                          "] = " + nums1[result1[0]] + " + " + nums1[result1[1]] + 
                          " = " + target1);
        System.out.println();
        
        // Test Case 2: Example 2
        int[] nums2 = {3, 2, 4};
        int target2 = 6;
        int[] result2 = twoSum(nums2, target2);
        System.out.println("Example 2:");
        System.out.println("Input: nums = [3,2,4], target = 6");
        System.out.println("Output: [" + result2[0] + "," + result2[1] + "]");
        System.out.println("Explanation: nums[" + result2[0] + "] + nums[" + result2[1] + 
                          "] = " + nums2[result2[0]] + " + " + nums2[result2[1]] + 
                          " = " + target2);
        System.out.println();
        
        // Test Case 3: Example 3
        int[] nums3 = {3, 3};
        int target3 = 6;
        int[] result3 = twoSum(nums3, target3);
        System.out.println("Example 3:");
        System.out.println("Input: nums = [3,3], target = 6");
        System.out.println("Output: [" + result3[0] + "," + result3[1] + "]");
        System.out.println("Explanation: nums[" + result3[0] + "] + nums[" + result3[1] + 
                          "] = " + nums3[result3[0]] + " + " + nums3[result3[1]] + 
                          " = " + target3);
        System.out.println();
        
        // Additional test case with negative numbers
        int[] nums4 = {-1, -2, -3, -4, -5};
        int target4 = -8;
        int[] result4 = twoSum(nums4, target4);
        System.out.println("Additional Test:");
        System.out.println("Input: nums = [-1,-2,-3,-4,-5], target = -8");
        System.out.println("Output: [" + result4[0] + "," + result4[1] + "]");
        System.out.println("Explanation: nums[" + result4[0] + "] + nums[" + result4[1] + 
                          "] = " + nums4[result4[0]] + " + " + nums4[result4[1]] + 
                          " = " + target4);
    }
}

