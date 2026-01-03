package com.prem.anagram;
public class HouseRobber {public static int maxLoot(int[]a){int prev2=0,prev1=0;for(int x:a){int cur=Math.max(prev1,prev2+x);prev2=prev1;prev1=cur;}return prev1;}}
