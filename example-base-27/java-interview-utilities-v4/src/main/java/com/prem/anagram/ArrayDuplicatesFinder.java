package com.prem.anagram;
import java.util.LinkedHashSet;import java.util.Set;
public class ArrayDuplicatesFinder { public static Set<Integer> find(int[] a){Set<Integer>s=new LinkedHashSet<>(),d=new LinkedHashSet<>();if(a==null)return d;for(int n:a)if(!s.add(n))d.add(n);return d;} }
