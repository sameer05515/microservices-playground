package com.prem.anagram;
public class ClimbingStairs {public static int ways(int n){if(n<=2)return Math.max(n,0);int a=1,b=2;for(int i=3;i<=n;i++){int c=a+b;a=b;b=c;}return b;}}
