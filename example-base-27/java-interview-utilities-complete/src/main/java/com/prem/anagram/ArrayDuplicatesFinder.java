package com.prem.anagram;
import java.util.LinkedHashSet;
import java.util.Set;
public class ArrayDuplicatesFinder {
    public static Set<Integer> find(int[] numbers) {
        Set<Integer> seen=new LinkedHashSet<>(), dup=new LinkedHashSet<>();
        if (numbers == null) return dup;
        for(int n:numbers) if(!seen.add(n)) dup.add(n);
        return dup;
    }
}
