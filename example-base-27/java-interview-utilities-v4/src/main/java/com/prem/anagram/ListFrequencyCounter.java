package com.prem.anagram;
import java.util.LinkedHashMap;import java.util.List;import java.util.Map;
public class ListFrequencyCounter { public static <T> Map<T,Integer> count(List<T>l){Map<T,Integer>m=new LinkedHashMap<>();if(l!=null)for(T x:l)m.merge(x,1,Integer::sum);return m;} }
