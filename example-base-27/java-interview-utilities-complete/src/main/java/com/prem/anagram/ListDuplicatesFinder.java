package com.prem.anagram;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
public class ListDuplicatesFinder {
    public static <T> Set<T> find(List<T> values) {
        Set<T> seen=new HashSet<>(), result=new HashSet<>();
        if(values==null) return result;
        for(T value:values) if(!seen.add(value)) result.add(value);
        return result;
    }
}
