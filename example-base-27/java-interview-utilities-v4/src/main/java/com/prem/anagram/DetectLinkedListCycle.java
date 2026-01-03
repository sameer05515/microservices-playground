package com.prem.anagram;
public class DetectLinkedListCycle { public static class Node{public int data;public Node next;public Node(int d){data=d;}} public static boolean hasCycle(Node head){Node s=head,f=head;while(f!=null&&f.next!=null){s=s.next;f=f.next.next;if(s==f)return true;}return false;} }
