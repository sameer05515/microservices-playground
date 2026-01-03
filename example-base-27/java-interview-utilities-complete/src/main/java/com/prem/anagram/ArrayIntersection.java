package com.prem.anagram;
import java.util.LinkedHashSet;
import java.util.Set;
public class ArrayIntersection {
    public static Set<Integer> find(int[] first,int[] second) {
        Set<Integer> values=new LinkedHashSet<>(), result=new LinkedHashSet<>();
        if(first==null || second==null) return result;
        for(int n:first) values.add(n);
        for(int n:second) if(values.contains(n)) result.add(n);
        return result;
    }
}
