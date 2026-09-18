package com.prem.anagram;
public class ReverseInteger { public static int reverse(int n){long r=0;while(n!=0){r=r*10+n%10;n/=10;}return r>Integer.MAX_VALUE||r<Integer.MIN_VALUE?0:(int)r;} }
