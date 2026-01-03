package com.leetcode;

/**
 * LeetCode Problem: Add Two Numbers
 * 
 * You are given two non-empty linked lists representing two non-negative integers.
 * The digits are stored in reverse order, and each of their nodes contains a single digit.
 * Add the two numbers and return the sum as a linked list.
 * 
 * You may assume the two numbers do not contain any leading zero, except the number 0 itself.
 * 
 * Time Complexity: O(max(m, n)) where m and n are the lengths of the two linked lists
 * Space Complexity: O(max(m, n)) for the result linked list
 */
public class AddTwoNumbers {
    
    /**
     * Adds two numbers represented as linked lists (digits in reverse order).
     * 
     * @param l1 First linked list representing a number
     * @param l2 Second linked list representing a number
     * @return Linked list representing the sum
     */
    public static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        // Create a dummy head node to simplify code
        ListNode dummyHead = new ListNode(0);
        ListNode current = dummyHead;
        int carry = 0;
        
        // Traverse both lists until both are exhausted
        while (l1 != null || l2 != null || carry != 0) {
            // Get the values from the current nodes (0 if null)
            int val1 = (l1 != null) ? l1.val : 0;
            int val2 = (l2 != null) ? l2.val : 0;
            
            // Calculate sum and carry
            int sum = val1 + val2 + carry;
            carry = sum / 10;
            int digit = sum % 10;
            
            // Create new node with the digit
            current.next = new ListNode(digit);
            current = current.next;
            
            // Move to next nodes if they exist
            if (l1 != null) {
                l1 = l1.next;
            }
            if (l2 != null) {
                l2 = l2.next;
            }
        }
        
        // Return the result (skip dummy head)
        return dummyHead.next;
    }
    
    /**
     * Main method with test cases
     */
    public static void main(String[] args) {
        // Test Case 1: Example 1
        // l1 = [2,4,3] represents 342
        // l2 = [5,6,4] represents 465
        // Expected: [7,0,8] represents 807
        ListNode l1_1 = ListNode.fromArray(new int[]{2, 4, 3});
        ListNode l2_1 = ListNode.fromArray(new int[]{5, 6, 4});
        ListNode result1 = addTwoNumbers(l1_1, l2_1);
        
        System.out.println("Example 1:");
        System.out.println("Input: l1 = [2,4,3], l2 = [5,6,4]");
        System.out.println("Output: " + ListNode.toString(result1));
        System.out.println("Explanation: 342 + 465 = 807");
        System.out.println();
        
        // Test Case 2: Example 2
        // l1 = [0] represents 0
        // l2 = [0] represents 0
        // Expected: [0] represents 0
        ListNode l1_2 = ListNode.fromArray(new int[]{0});
        ListNode l2_2 = ListNode.fromArray(new int[]{0});
        ListNode result2 = addTwoNumbers(l1_2, l2_2);
        
        System.out.println("Example 2:");
        System.out.println("Input: l1 = [0], l2 = [0]");
        System.out.println("Output: " + ListNode.toString(result2));
        System.out.println("Explanation: 0 + 0 = 0");
        System.out.println();
        
        // Test Case 3: Example 3
        // l1 = [9,9,9,9,9,9,9] represents 9999999
        // l2 = [9,9,9,9] represents 9999
        // Expected: [8,9,9,9,0,0,0,1] represents 10009998
        ListNode l1_3 = ListNode.fromArray(new int[]{9, 9, 9, 9, 9, 9, 9});
        ListNode l2_3 = ListNode.fromArray(new int[]{9, 9, 9, 9});
        ListNode result3 = addTwoNumbers(l1_3, l2_3);
        
        System.out.println("Example 3:");
        System.out.println("Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]");
        System.out.println("Output: " + ListNode.toString(result3));
        System.out.println("Explanation: 9999999 + 9999 = 10009998");
        System.out.println();
        
        // Additional test case: Different lengths
        // l1 = [1,8] represents 81
        // l2 = [0] represents 0
        // Expected: [1,8] represents 81
        ListNode l1_4 = ListNode.fromArray(new int[]{1, 8});
        ListNode l2_4 = ListNode.fromArray(new int[]{0});
        ListNode result4 = addTwoNumbers(l1_4, l2_4);
        
        System.out.println("Additional Test:");
        System.out.println("Input: l1 = [1,8], l2 = [0]");
        System.out.println("Output: " + ListNode.toString(result4));
        System.out.println("Explanation: 81 + 0 = 81");
    }
}
