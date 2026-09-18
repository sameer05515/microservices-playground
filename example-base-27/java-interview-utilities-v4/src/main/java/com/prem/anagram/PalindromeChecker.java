package com.prem.anagram;
public class PalindromeChecker { public static boolean isPalindrome(String s){if(s==null)return false;s=s.replaceAll("\\s+","").toLowerCase();for(int l=0,r=s.length()-1;l<r;l++,r--)if(s.charAt(l)!=s.charAt(r))return false;return true;} }
