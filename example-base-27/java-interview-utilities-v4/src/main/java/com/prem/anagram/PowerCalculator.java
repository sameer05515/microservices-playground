package com.prem.anagram;
public class PowerCalculator {public static long power(long x,int n){if(n<0)throw new IllegalArgumentException();if(n==0)return 1;long half=power(x,n/2);return n%2==0?half*half:x*half*half;}}
