package com.prem.anagram;
public class PalindromeNumberChecker { public static boolean isPalindrome(int n){if(n<0)return false;int o=n,r=0;while(n>0){r=r*10+n%10;n/=10;}return o==r;} }
