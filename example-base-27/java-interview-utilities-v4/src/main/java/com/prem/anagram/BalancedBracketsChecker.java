package com.prem.anagram;
import java.util.ArrayDeque;import java.util.Deque;import java.util.Map;
public class BalancedBracketsChecker {private static final Map<Character,Character>P=Map.of(')','(',']','[','}','{');public static boolean isBalanced(String s){if(s==null)return false;Deque<Character>d=new ArrayDeque<>();for(char c:s.toCharArray()){if(c=='('||c=='['||c=='{')d.push(c);else if(P.containsKey(c)&&(d.isEmpty()||d.pop()!=P.get(c)))return false;}return d.isEmpty();}}
