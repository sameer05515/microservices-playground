package com.leetcode;

/**
 * LeetCode Problem: Median of Two Sorted Arrays
 * 
 * Given two sorted arrays nums1 and nums2 of size m and n respectively,
 * return the median of the two sorted arrays.
 * 
 * The overall run time complexity should be O(log (m+n)).
 * 
 * Time Complexity: O(log(min(m, n))) where m and n are the lengths of the arrays
 * Space Complexity: O(1)
 * 
 * Solution: Uses binary search to partition both arrays without merging them
 */
public class MedianOfTwoSortedArrays {
    
    /**
     * Finds the median of two sorted arrays using binary search.
     * 
     * @param nums1 First sorted array
     * @param nums2 Second sorted array
     * @return Median value as a double
     */
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Ensure nums1 is the smaller array to optimize binary search
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int m = nums1.length;
        int n = nums2.length;
        int left = 0;
        int right = m;
        
        // Binary search on the smaller array
        while (left <= right) {
            // Partition nums1 at position partitionX
            int partitionX = (left + right) / 2;
            // Partition nums2 at position partitionY such that:
            // (partitionX + partitionY) = (m + n + 1) / 2
            int partitionY = (m + n + 1) / 2 - partitionX;
            
            // Handle edge cases for left and right parts
            int maxLeftX = (partitionX == 0) ? Integer.MIN_VALUE : nums1[partitionX - 1];
            int minRightX = (partitionX == m) ? Integer.MAX_VALUE : nums1[partitionX];
            
            int maxLeftY = (partitionY == 0) ? Integer.MIN_VALUE : nums2[partitionY - 1];
            int minRightY = (partitionY == n) ? Integer.MAX_VALUE : nums2[partitionY];
            
            // Check if we found the correct partition
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                // Found the correct partition, calculate median
                if ((m + n) % 2 == 0) {
                    // Even number of elements: average of two middle elements
                    return (Math.max(maxLeftX, maxLeftY) + Math.min(minRightX, minRightY)) / 2.0;
                } else {
                    // Odd number of elements: middle element (from left partition)
                    return Math.max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                // Too far right on nums1, move left
                right = partitionX - 1;
            } else {
                // Too far left on nums1, move right
                left = partitionX + 1;
            }
        }
        
        // Should never reach here
        throw new IllegalArgumentException("Input arrays are invalid");
    }
    
    /**
     * Alternative implementation using merge approach (O(m+n) time complexity).
     * This is simpler but doesn't meet the O(log(m+n)) requirement.
     * Included for comparison and understanding.
     * 
     * @param nums1 First sorted array
     * @param nums2 Second sorted array
     * @return Median value as a double
     */
    public static double findMedianSortedArraysMerge(int[] nums1, int[] nums2) {
        int m = nums1.length;
        int n = nums2.length;
        int totalLength = m + n;
        int[] merged = new int[totalLength];
        
        int i = 0, j = 0, k = 0;
        
        // Merge the two arrays
        while (i < m && j < n) {
            if (nums1[i] <= nums2[j]) {
                merged[k++] = nums1[i++];
            } else {
                merged[k++] = nums2[j++];
            }
        }
        
        // Add remaining elements from nums1
        while (i < m) {
            merged[k++] = nums1[i++];
        }
        
        // Add remaining elements from nums2
        while (j < n) {
            merged[k++] = nums2[j++];
        }
        
        // Find median from merged array
        if (totalLength % 2 == 0) {
            int mid1 = merged[totalLength / 2 - 1];
            int mid2 = merged[totalLength / 2];
            return (mid1 + mid2) / 2.0;
        } else {
            return merged[totalLength / 2];
        }
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        int[] nums1_1 = {1, 3};
        int[] nums2_1 = {2};
        double result1 = findMedianSortedArrays(nums1_1, nums2_1);
        
        System.out.println("Example 1:");
        System.out.println("Input: nums1 = [1,3], nums2 = [2]");
        System.out.printf("Output: %.5f%n", result1);
        System.out.println("Explanation: merged array = [1,2,3] and median is 2.");
        System.out.println();
        
        // Test Case 2: Example 2
        int[] nums1_2 = {1, 2};
        int[] nums2_2 = {3, 4};
        double result2 = findMedianSortedArrays(nums1_2, nums2_2);
        
        System.out.println("Example 2:");
        System.out.println("Input: nums1 = [1,2], nums2 = [3,4]");
        System.out.printf("Output: %.5f%n", result2);
        System.out.println("Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5");
        System.out.println();
        
        // Additional test case: One array is empty
        int[] nums1_3 = {};
        int[] nums2_3 = {1};
        double result3 = findMedianSortedArrays(nums1_3, nums2_3);
        
        System.out.println("One empty array:");
        System.out.println("Input: nums1 = [], nums2 = [1]");
        System.out.printf("Output: %.5f%n", result3);
        System.out.println();
        
        // Additional test case: Both arrays have same length
        int[] nums1_4 = {1, 2};
        int[] nums2_4 = {3, 4};
        double result4 = findMedianSortedArrays(nums1_4, nums2_4);
        
        System.out.println("Same length arrays:");
        System.out.println("Input: nums1 = [1,2], nums2 = [3,4]");
        System.out.printf("Output: %.5f%n", result4);
        System.out.println();
        
        // Additional test case: Overlapping ranges
        int[] nums1_5 = {1, 3, 5};
        int[] nums2_5 = {2, 4, 6};
        double result5 = findMedianSortedArrays(nums1_5, nums2_5);
        
        System.out.println("Overlapping ranges:");
        System.out.println("Input: nums1 = [1,3,5], nums2 = [2,4,6]");
        System.out.printf("Output: %.5f%n", result5);
        System.out.println("Explanation: merged array = [1,2,3,4,5,6] and median is (3 + 4) / 2 = 3.5");
        System.out.println();
        
        // Additional test case: One array entirely smaller
        int[] nums1_6 = {1, 2};
        int[] nums2_6 = {5, 6, 7};
        double result6 = findMedianSortedArrays(nums1_6, nums2_6);
        
        System.out.println("One array entirely smaller:");
        System.out.println("Input: nums1 = [1,2], nums2 = [5,6,7]");
        System.out.printf("Output: %.5f%n", result6);
        System.out.println("Explanation: merged array = [1,2,5,6,7] and median is 5");
    }
}
