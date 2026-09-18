package com.prem.anagram;
public class LongestCommonSubsequence {public static int length(String a,String b){if(a==null||b==null)return 0;int[][]dp=new int[a.length()+1][b.length()+1];for(int i=1;i<=a.length();i++)for(int j=1;j<=b.length();j++)dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);return dp[a.length()][b.length()];}}
