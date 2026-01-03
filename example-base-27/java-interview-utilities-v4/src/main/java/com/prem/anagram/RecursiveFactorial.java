package com.prem.anagram;
public class RecursiveFactorial {public static long calculate(int n){if(n<0)throw new IllegalArgumentException();return n<=1?1:n*calculate(n-1);}}
