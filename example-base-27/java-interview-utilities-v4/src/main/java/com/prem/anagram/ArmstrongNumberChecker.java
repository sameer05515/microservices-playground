package com.prem.anagram;
public class ArmstrongNumberChecker { public static boolean isArmstrong(int n){if(n<0)return false;int o=n,d=String.valueOf(n).length(),sum=0;do{int x=n%10;sum+=(int)Math.pow(x,d);n/=10;}while(n>0);return sum==o;} }
