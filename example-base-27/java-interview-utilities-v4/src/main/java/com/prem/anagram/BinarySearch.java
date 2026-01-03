package com.prem.anagram;
public class BinarySearch { public static int search(int[]a,int target){if(a==null)return-1;int l=0,r=a.length-1;while(l<=r){int m=l+(r-l)/2;if(a[m]==target)return m;if(a[m]<target)l=m+1;else r=m-1;}return-1;} }
