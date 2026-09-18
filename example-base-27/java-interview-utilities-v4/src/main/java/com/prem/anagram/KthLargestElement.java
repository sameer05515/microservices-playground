package com.prem.anagram;
import java.util.PriorityQueue;
public class KthLargestElement {public static int find(int[]a,int k){if(a==null||k<1||k>a.length)throw new IllegalArgumentException("Invalid k");PriorityQueue<Integer>h=new PriorityQueue<>();for(int x:a){h.offer(x);if(h.size()>k)h.poll();}return h.peek();}}
