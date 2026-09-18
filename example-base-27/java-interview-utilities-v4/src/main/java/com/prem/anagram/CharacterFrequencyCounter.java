package com.prem.anagram;
import java.util.LinkedHashMap;import java.util.Map;
public class CharacterFrequencyCounter { public static Map<Character,Integer> count(String s){Map<Character,Integer> m=new LinkedHashMap<>();if(s==null)return m;for(char c:s.toLowerCase().toCharArray())if(!Character.isWhitespace(c))m.merge(c,1,Integer::sum);return m;} }
