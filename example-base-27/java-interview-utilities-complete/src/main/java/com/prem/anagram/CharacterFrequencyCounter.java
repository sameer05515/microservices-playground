package com.prem.anagram;
import java.util.LinkedHashMap;
import java.util.Map;
public class CharacterFrequencyCounter {
    public static Map<Character,Integer> count(String input) {
        Map<Character,Integer> result = new LinkedHashMap<>();
        if (input == null) return result;
        for (char c : input.toLowerCase().toCharArray())
            if (!Character.isWhitespace(c)) result.merge(c, 1, Integer::sum);
        return result;
    }
}
