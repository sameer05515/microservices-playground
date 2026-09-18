package com.prem.anagram;
public class ArrayRotation { public static void rotateRight(int[]a,int k){if(a==null||a.length==0)return;k%=a.length;if(k<0)k+=a.length;rev(a,0,a.length-1);rev(a,0,k-1);rev(a,k,a.length-1);}private static void rev(int[]a,int l,int r){while(l<r){int t=a[l];a[l++]=a[r];a[r--]=t;}} }
