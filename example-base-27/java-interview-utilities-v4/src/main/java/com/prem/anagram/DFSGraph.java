package com.prem.anagram;
import java.util.*;
public class DFSGraph {public static List<Integer> traverse(Map<Integer,List<Integer>>g,int start){List<Integer>r=new ArrayList<>();dfs(g,start,new HashSet<>(),r);return r;}private static void dfs(Map<Integer,List<Integer>>g,int n,Set<Integer>v,List<Integer>r){if(!v.add(n))return;r.add(n);for(int x:g.getOrDefault(n,List.of()))dfs(g,x,v,r);}}
