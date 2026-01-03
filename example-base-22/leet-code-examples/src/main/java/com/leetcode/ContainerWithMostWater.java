package com.leetcode;

/**
 * LeetCode Problem: Container With Most Water
 * 
 * You are given an integer array height of length n. There are n vertical lines drawn such that
 * the two endpoints of the ith line are (i, 0) and (i, height[i]).
 * 
 * Find two lines that together with the x-axis form a container, such that the container
 * contains the most water.
 * 
 * Return the maximum amount of water a container can store.
 * 
 * Notice that you may not slant the container.
 * 
 * Time Complexity: O(n) where n is the length of the height array
 * Space Complexity: O(1)
 * 
 * Solution: Uses two-pointer technique starting from both ends
 */
public class ContainerWithMostWater {
    
    /**
     * Finds the maximum area of water that can be contained using two-pointer approach.
     * 
     * @param height Array of heights representing vertical lines
     * @return Maximum area of water that can be contained
     */
    public static int maxArea(int[] height) {
        int left = 0;
        int right = height.length - 1;
        int maxArea = 0;
        
        // Use two pointers approach
        while (left < right) {
            // Calculate current area
            // Area = min(height[left], height[right]) * (right - left)
            int currentArea = Math.min(height[left], height[right]) * (right - left);
            maxArea = Math.max(maxArea, currentArea);
            
            // Move the pointer with the smaller height
            // This is because the area is limited by the smaller height,
            // so moving the pointer with larger height won't help
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        
        return maxArea;
    }
    
    /**
     * Alternative brute-force implementation for comparison (O(n^2) time complexity).
     * Tests all possible pairs of lines.
     * 
     * @param height Array of heights representing vertical lines
     * @return Maximum area of water that can be contained
     */
    public static int maxAreaBruteForce(int[] height) {
        int maxArea = 0;
        int n = height.length;
        
        // Try all possible pairs
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int area = Math.min(height[i], height[j]) * (j - i);
                maxArea = Math.max(maxArea, area);
            }
        }
        
        return maxArea;
    }
    
    /**
     * Helper method to visualize the container (for understanding/debugging).
     * Prints a simple ASCII representation.
     * 
     * @param height Array of heights
     * @param left Left index
     * @param right Right index
     */
    public static void visualizeContainer(int[] height, int left, int right) {
        int maxHeight = 0;
        for (int h : height) {
            maxHeight = Math.max(maxHeight, h);
        }
        
        System.out.println("Container visualization:");
        for (int row = maxHeight; row > 0; row--) {
            for (int col = 0; col < height.length; col++) {
                if (col == left || col == right) {
                    if (height[col] >= row) {
                        System.out.print("|");
                    } else {
                        System.out.print(" ");
                    }
                } else if (col > left && col < right && row <= Math.min(height[left], height[right])) {
                    System.out.print("~"); // Water
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
        
        // Print indices
        for (int col = 0; col < height.length; col++) {
            System.out.print(col);
        }
        System.out.println();
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        int[] height1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        int result1 = maxArea(height1);
        
        System.out.println("Example 1:");
        System.out.print("Input: height = [");
        for (int i = 0; i < height1.length; i++) {
            System.out.print(height1[i]);
            if (i < height1.length - 1) System.out.print(",");
        }
        System.out.println("]");
        System.out.println("Output: " + result1);
        System.out.println("Explanation: The max area is between indices 1 and 8 (heights 8 and 7)");
        System.out.println("Area = min(8, 7) * (8 - 1) = 7 * 7 = 49");
        System.out.println();
        
        // Test Case 2: Example 2
        int[] height2 = {1, 1};
        int result2 = maxArea(height2);
        
        System.out.println("Example 2:");
        System.out.print("Input: height = [");
        for (int i = 0; i < height2.length; i++) {
            System.out.print(height2[i]);
            if (i < height2.length - 1) System.out.print(",");
        }
        System.out.println("]");
        System.out.println("Output: " + result2);
        System.out.println("Explanation: Area = min(1, 1) * (1 - 0) = 1 * 1 = 1");
        System.out.println();
        
        // Additional test case: All same height
        int[] height3 = {3, 3, 3, 3, 3};
        int result3 = maxArea(height3);
        
        System.out.println("All same height:");
        System.out.print("Input: height = [3,3,3,3,3]");
        System.out.println();
        System.out.println("Output: " + result3);
        System.out.println("Explanation: Area = min(3, 3) * (4 - 0) = 3 * 4 = 12");
        System.out.println();
        
        // Additional test case: Increasing heights
        int[] height4 = {1, 2, 3, 4, 5};
        int result4 = maxArea(height4);
        
        System.out.println("Increasing heights:");
        System.out.print("Input: height = [1,2,3,4,5]");
        System.out.println();
        System.out.println("Output: " + result4);
        System.out.println("Explanation: Area = min(1, 5) * (4 - 0) = 1 * 4 = 4");
        System.out.println();
        
        // Additional test case: Decreasing heights
        int[] height5 = {5, 4, 3, 2, 1};
        int result5 = maxArea(height5);
        
        System.out.println("Decreasing heights:");
        System.out.print("Input: height = [5,4,3,2,1]");
        System.out.println();
        System.out.println("Output: " + result5);
        System.out.println("Explanation: Area = min(5, 1) * (4 - 0) = 1 * 4 = 4");
        System.out.println();
        
        // Additional test case: Heights with zero
        int[] height6 = {1, 0, 2, 0, 3};
        int result6 = maxArea(height6);
        
        System.out.println("Heights with zero:");
        System.out.print("Input: height = [1,0,2,0,3]");
        System.out.println();
        System.out.println("Output: " + result6);
        System.out.println();
        
        // Additional test case: Two tall lines at ends
        int[] height7 = {6, 2, 5, 4, 5, 1, 6};
        int result7 = maxArea(height7);
        
        System.out.println("Two tall lines at ends:");
        System.out.print("Input: height = [6,2,5,4,5,1,6]");
        System.out.println();
        System.out.println("Output: " + result7);
        System.out.println("Explanation: Best area is between indices 0 and 6");
        System.out.println("Area = min(6, 6) * (6 - 0) = 6 * 6 = 36");
    }
}
