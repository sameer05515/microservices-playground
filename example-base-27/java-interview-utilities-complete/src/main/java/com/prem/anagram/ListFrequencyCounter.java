package com.prem.anagram;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
public class ListFrequencyCounter {
    public static <T> Map<T,Integer> count(List<T> values) {
        Map<T,Integer> result=new LinkedHashMap<>();
        if(values==null) return result;
        for(T value:values) result.merge(value,1,Integer::sum);
        return result;
    }
}
