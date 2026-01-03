package com.prem.anagram;
import java.util.HashMap;
import java.util.Map;
public class HashMapAnagramChecker {
    public static boolean isAnagram(String a,String b){if(a==null||b==null)return false;a=a.replaceAll("\\s+","").toLowerCase();b=b.replaceAll("\\s+","").toLowerCase();if(a.length()!=b.length())return false;Map<Character,Integer> m=new HashMap<>();for(char c:a.toCharArray())m.merge(c,1,Integer::sum);for(char c:b.toCharArray()){Integer n=m.get(c);if(n==null)return false;if(n==1)m.remove(c);else m.put(c,n-1);}return m.isEmpty();}
}
