package com.prem.anagram;
public class FibonacciDP {public static long calculate(int n){if(n<0)throw new IllegalArgumentException();if(n<2)return n;long[]dp=new long[n+1];dp[1]=1;for(int i=2;i<=n;i++)dp[i]=dp[i-1]+dp[i-2];return dp[n];}}
