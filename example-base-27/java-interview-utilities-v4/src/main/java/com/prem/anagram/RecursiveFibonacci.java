package com.prem.anagram;
public class RecursiveFibonacci {public static long calculate(int n){if(n<0)throw new IllegalArgumentException();return n<=1?n:calculate(n-1)+calculate(n-2);}}
