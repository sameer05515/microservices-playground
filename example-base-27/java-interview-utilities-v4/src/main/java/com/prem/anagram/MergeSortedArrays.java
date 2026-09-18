package com.prem.anagram;
public class MergeSortedArrays { public static int[] merge(int[]a,int[]b){if(a==null)return b==null?new int[0]:b.clone();if(b==null)return a.clone();int[]r=new int[a.length+b.length];int i=0,j=0,k=0;while(i<a.length&&j<b.length)r[k++]=a[i]<=b[j]?a[i++]:b[j++];while(i<a.length)r[k++]=a[i++];while(j<b.length)r[k++]=b[j++];return r;} }
