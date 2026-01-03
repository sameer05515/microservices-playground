package com.prem.anagram;
import java.util.Arrays;
public class SortingAnagramChecker {
    public static boolean isAnagram(String a,String b){if(a==null||b==null)return false;a=a.replaceAll("\\s+","").toLowerCase();b=b.replaceAll("\\s+","").toLowerCase();if(a.length()!=b.length())return false;char[] x=a.toCharArray(),y=b.toCharArray();Arrays.sort(x);Arrays.sort(y);return Arrays.equals(x,y);}
}
