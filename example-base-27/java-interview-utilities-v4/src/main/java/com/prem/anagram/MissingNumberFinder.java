package com.prem.anagram;
public class MissingNumberFinder { public static int findUsingSum(int[]a){int n=a.length;long sum=(long)n*(n+1)/2;for(int x:a)sum-=x;return(int)sum;} public static int findUsingXor(int[]a){int r=a.length;for(int i=0;i<a.length;i++)r^=i^a[i];return r;} }
