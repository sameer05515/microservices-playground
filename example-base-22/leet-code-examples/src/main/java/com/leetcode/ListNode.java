package com.leetcode;

/**
 * Definition for singly-linked list.
 * This class represents a node in a linked list.
 */
public class ListNode {
    int val;
    ListNode next;
    
    ListNode() {}
    
    ListNode(int val) {
        this.val = val;
    }
    
    ListNode(int val, ListNode next) {
        this.val = val;
        this.next = next;
    }
    
    /**
     * Helper method to create a linked list from an array
     * 
     * @param values Array of integer values
     * @return Head of the created linked list
     */
    public static ListNode fromArray(int[] values) {
        if (values == null || values.length == 0) {
            return null;
        }
        
        ListNode head = new ListNode(values[0]);
        ListNode current = head;
        
        for (int i = 1; i < values.length; i++) {
            current.next = new ListNode(values[i]);
            current = current.next;
        }
        
        return head;
    }
    
    /**
     * Helper method to convert linked list to array
     * 
     * @param head Head of the linked list
     * @return Array representation of the linked list
     */
    public static int[] toArray(ListNode head) {
        if (head == null) {
            return new int[0];
        }
        
        int count = 0;
        ListNode current = head;
        while (current != null) {
            count++;
            current = current.next;
        }
        
        int[] result = new int[count];
        current = head;
        int index = 0;
        while (current != null) {
            result[index++] = current.val;
            current = current.next;
        }
        
        return result;
    }
    
    /**
     * Helper method to get string representation of linked list
     * 
     * @param head Head of the linked list
     * @return String representation like [2,4,3]
     */
    public static String toString(ListNode head) {
        if (head == null) {
            return "[]";
        }
        
        StringBuilder sb = new StringBuilder("[");
        ListNode current = head;
        while (current != null) {
            sb.append(current.val);
            if (current.next != null) {
                sb.append(",");
            }
            current = current.next;
        }
        sb.append("]");
        return sb.toString();
    }
}
