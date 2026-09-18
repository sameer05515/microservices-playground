package com.prem.anagram;
import java.util.LinkedHashMap;
import java.util.Map;
public class WordCount {
    public static Map<String,Integer> count(String input) {
        Map<String,Integer> result=new LinkedHashMap<>();
        if(input==null || input.isBlank()) return result;
        for(String word:input.toLowerCase().trim().split("\\s+"))
            result.merge(word,1,Integer::sum);
        return result;
    }
}
