package com.prem.anagram;
public class MaxMinFinder { public record Result(int min,int max){} public static Result find(int[]a){if(a==null||a.length==0)throw new IllegalArgumentException("Array must not be empty");int min=a[0],max=a[0];for(int x:a){min=Math.min(min,x);max=Math.max(max,x);}return new Result(min,max);} }
