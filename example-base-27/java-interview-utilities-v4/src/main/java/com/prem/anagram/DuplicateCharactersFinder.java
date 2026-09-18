package com.prem.anagram;
import java.util.LinkedHashSet;import java.util.Set;
public class DuplicateCharactersFinder { public static Set<Character> find(String s){Set<Character>a=new LinkedHashSet<>(),d=new LinkedHashSet<>();if(s==null)return d;for(char c:s.toLowerCase().toCharArray())if(!Character.isWhitespace(c)&&!a.add(c))d.add(c);return d;} }
