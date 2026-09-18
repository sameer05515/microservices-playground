package com.prem.anagram;
public class CounterWithSynchronized {private int value;public synchronized void increment(){value++;}public synchronized int get(){return value;}public void incrementMany(int n){for(int i=0;i<n;i++)increment();}}
