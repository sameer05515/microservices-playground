package com.prem.anagram;
public class RemoveDuplicatesFromSortedArray { public static int remove(int[]a){if(a==null||a.length==0)return 0;int w=1;for(int r=1;r<a.length;r++)if(a[r]!=a[r-1])a[w++]=a[r];return w;} }
