package com.prem.anagram;
import java.util.HashSet;import java.util.List;import java.util.Set;
public class ListDuplicatesFinder { public static <T> Set<T> find(List<T>l){Set<T>s=new HashSet<>(),d=new HashSet<>();if(l==null)return d;for(T x:l)if(!s.add(x))d.add(x);return d;} }
