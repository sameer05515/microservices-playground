package com.prem.anagram;
public class FindMiddleLinkedList { public static class Node{public int data;public Node next;public Node(int d){data=d;}} public static Node find(Node head){Node slow=head,fast=head;while(fast!=null&&fast.next!=null){slow=slow.next;fast=fast.next.next;}return slow;} }
