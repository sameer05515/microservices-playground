package com.prem.anagram;
import java.util.*;
public class BFSGraph {public static List<Integer> traverse(Map<Integer,List<Integer>>g,int start){List<Integer>r=new ArrayList<>();Set<Integer>v=new HashSet<>();Queue<Integer>q=new ArrayDeque<>();q.offer(start);v.add(start);while(!q.isEmpty()){int n=q.poll();r.add(n);for(int x:g.getOrDefault(n,List.of()))if(v.add(x))q.offer(x);}return r;}}
