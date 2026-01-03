package com.prem.anagram;
public class FrequencyArrayAnagramChecker {
    public static boolean isAnagram(String a,String b){if(a==null||b==null)return false;a=a.replaceAll("\\s+","").toLowerCase();b=b.replaceAll("\\s+","").toLowerCase();if(a.length()!=b.length())return false;int[] f=new int[256];for(int i=0;i<a.length();i++){if(a.charAt(i)>=256||b.charAt(i)>=256)return false;f[a.charAt(i)]++;f[b.charAt(i)]--;}for(int n:f)if(n!=0)return false;return true;}
}
