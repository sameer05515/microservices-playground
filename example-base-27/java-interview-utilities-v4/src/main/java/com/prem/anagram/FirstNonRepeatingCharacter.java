package com.prem.anagram;
import java.util.LinkedHashMap;import java.util.Map;
public class FirstNonRepeatingCharacter { public static Character find(String s){if(s==null)return null;Map<Character,Integer>m=new LinkedHashMap<>();for(char c:s.toLowerCase().toCharArray())if(!Character.isWhitespace(c))m.merge(c,1,Integer::sum);for(var e:m.entrySet())if(e.getValue()==1)return e.getKey();return null;} }
