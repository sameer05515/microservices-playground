package com.prem.anagram;
import java.util.LinkedHashMap;import java.util.Map;
public class WordCount { public static Map<String,Integer> count(String s){Map<String,Integer>m=new LinkedHashMap<>();if(s==null||s.isBlank())return m;for(String w:s.toLowerCase().trim().split("\\s+"))m.merge(w,1,Integer::sum);return m;} }
