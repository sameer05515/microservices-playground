package com.prem.anagram;
import java.util.PriorityQueue;
public class MinHeap {private final PriorityQueue<Integer>heap=new PriorityQueue<>();public void add(int x){heap.offer(x);}public int peek(){return heap.element();}public int poll(){return heap.remove();}public int size(){return heap.size();}}
