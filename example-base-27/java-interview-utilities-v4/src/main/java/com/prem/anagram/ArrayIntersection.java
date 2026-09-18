package com.prem.anagram;
import java.util.LinkedHashSet;import java.util.Set;
public class ArrayIntersection { public static Set<Integer> find(int[]a,int[]b){Set<Integer>s=new LinkedHashSet<>(),r=new LinkedHashSet<>();if(a==null||b==null)return r;for(int x:a)s.add(x);for(int x:b)if(s.contains(x))r.add(x);return r;} }
