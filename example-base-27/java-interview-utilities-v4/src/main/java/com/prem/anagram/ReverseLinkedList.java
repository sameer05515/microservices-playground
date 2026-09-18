package com.prem.anagram;
public class ReverseLinkedList { public static class Node{public int data;public Node next;public Node(int d){data=d;}} public static Node reverse(Node head){Node prev=null,cur=head;while(cur!=null){Node next=cur.next;cur.next=prev;prev=cur;cur=next;}return prev;} }
