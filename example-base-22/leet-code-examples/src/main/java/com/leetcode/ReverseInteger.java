package com.leetcode;

/**
 * LeetCode Problem: Reverse Integer
 * 
 * Given a signed 32-bit integer x, return x with its digits reversed.
 * If reversing x causes the value to go outside the signed 32-bit integer range
 * [-2^31, 2^31 - 1], then return 0.
 * 
 * Assume the environment does not allow you to store 64-bit integers (signed or unsigned).
 * 
 * Time Complexity: O(log(x)) where x is the input number (number of digits)
 * Space Complexity: O(1)
 * 
 * Solution: Extract digits one by one and reverse, checking for overflow before multiplication
 */
public class ReverseInteger {
    
    /**
     * Reverses the digits of an integer with overflow protection.
     * 
     * @param x Input integer to reverse
     * @return Reversed integer, or 0 if overflow occurs
     */
    public static int reverse(int x) {
        int rev = 0;
        
        while (x != 0) {
            // Extract the last digit
            int pop = x % 10;
            x /= 10;
            
            // Check for overflow before multiplying by 10
            // For positive numbers: rev * 10 + pop > Integer.MAX_VALUE
            // This means: rev > (Integer.MAX_VALUE - pop) / 10
            // Or: rev > Integer.MAX_VALUE / 10 (since pop is at most 7 or -8)
            if (rev > Integer.MAX_VALUE / 10 || 
                (rev == Integer.MAX_VALUE / 10 && pop > 7)) {
                return 0; // Positive overflow
            }
            
            // For negative numbers: rev * 10 + pop < Integer.MIN_VALUE
            // This means: rev < (Integer.MIN_VALUE - pop) / 10
            // Or: rev < Integer.MIN_VALUE / 10 (since pop is at least -8)
            if (rev < Integer.MIN_VALUE / 10 || 
                (rev == Integer.MIN_VALUE / 10 && pop < -8)) {
                return 0; // Negative overflow
            }
            
            // Safe to multiply and add
            rev = rev * 10 + pop;
        }
        
        return rev;
    }
    
    /**
     * Alternative implementation using String conversion (less efficient).
     * Included for comparison, but note: this may use more space.
     * 
     * @param x Input integer to reverse
     * @return Reversed integer, or 0 if overflow occurs
     */
    public static int reverseString(int x) {
        // Handle special case
        if (x == Integer.MIN_VALUE || x == Integer.MAX_VALUE) {
            return 0;
        }
        
        // Determine if negative
        boolean isNegative = x < 0;
        x = Math.abs(x);
        
        // Convert to string and reverse
        String str = String.valueOf(x);
        String reversed = new StringBuilder(str).reverse().toString();
        
        // Convert back to integer with overflow check
        try {
            int result = Integer.parseInt(reversed);
            return isNegative ? -result : result;
        } catch (NumberFormatException e) {
            return 0; // Overflow occurred
        }
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        int x1 = 123;
        int result1 = reverse(x1);
        
        System.out.println("Example 1:");
        System.out.println("Input: x = " + x1);
        System.out.println("Output: " + result1);
        System.out.println();
        
        // Test Case 2: Example 2
        int x2 = -123;
        int result2 = reverse(x2);
        
        System.out.println("Example 2:");
        System.out.println("Input: x = " + x2);
        System.out.println("Output: " + result2);
        System.out.println();
        
        // Test Case 3: Example 3
        int x3 = 120;
        int result3 = reverse(x3);
        
        System.out.println("Example 3:");
        System.out.println("Input: x = " + x3);
        System.out.println("Output: " + result3);
        System.out.println("Explanation: Reversing 120, we get 021 which is 21");
        System.out.println();
        
        // Additional test case: Single digit
        int x4 = 5;
        int result4 = reverse(x4);
        
        System.out.println("Single digit:");
        System.out.println("Input: x = " + x4);
        System.out.println("Output: " + result4);
        System.out.println();
        
        // Additional test case: Overflow positive
        int x5 = 1534236469; // Reversed would exceed Integer.MAX_VALUE
        int result5 = reverse(x5);
        
        System.out.println("Positive overflow:");
        System.out.println("Input: x = " + x5);
        System.out.println("Output: " + result5);
        System.out.println("Explanation: Reversing causes overflow, return 0");
        System.out.println();
        
        // Additional test case: Overflow negative
        int x6 = -1534236469;
        int result6 = reverse(x6);
        
        System.out.println("Negative overflow:");
        System.out.println("Input: x = " + x6);
        System.out.println("Output: " + result6);
        System.out.println("Explanation: Reversing causes overflow, return 0");
        System.out.println();
        
        // Additional test case: Integer.MAX_VALUE
        int x7 = Integer.MAX_VALUE;
        int result7 = reverse(x7);
        
        System.out.println("Integer.MAX_VALUE:");
        System.out.println("Input: x = " + x7);
        System.out.println("Output: " + result7);
        System.out.println();
        
        // Additional test case: Integer.MIN_VALUE
        int x8 = Integer.MIN_VALUE;
        int result8 = reverse(x8);
        
        System.out.println("Integer.MIN_VALUE:");
        System.out.println("Input: x = " + x8);
        System.out.println("Output: " + result8);
        System.out.println();
        
        // Additional test case: Zero
        int x9 = 0;
        int result9 = reverse(x9);
        
        System.out.println("Zero:");
        System.out.println("Input: x = " + x9);
        System.out.println("Output: " + result9);
        System.out.println();
        
        // Additional test case: Ending with zeros
        int x10 = 100000;
        int result10 = reverse(x10);
        
        System.out.println("Ending with zeros:");
        System.out.println("Input: x = " + x10);
        System.out.println("Output: " + result10);
        System.out.println("Explanation: Reversing 100000, we get 000001 which is 1");
    }
}
