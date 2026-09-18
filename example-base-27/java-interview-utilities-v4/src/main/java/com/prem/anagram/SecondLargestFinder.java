package com.prem.anagram;
public class SecondLargestFinder { public static Integer find(int[] a){if(a==null||a.length<2)return null;Integer max=null,second=null;for(int n:a)if(max==null||n>max){second=max;max=n;}else if(n!=max&&(second==null||n>second))second=n;return second;} }
