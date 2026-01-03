package com.prem.anagram;
public class LongestWordFinder { public static String find(String s){if(s==null||s.isBlank())return null;String r="";for(String w:s.trim().split("\\s+"))if(w.length()>r.length())r=w;return r;} }
