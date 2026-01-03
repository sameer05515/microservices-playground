package com.prem.anagram;
import java.util.LinkedHashMap;
import java.util.Map;
public class FirstNonRepeatingCharacter {
    public static Character find(String input) {
        if (input == null) return null;
        Map<Character,Integer> map = new LinkedHashMap<>();
        for (char c : input.toLowerCase().toCharArray())
            if (!Character.isWhitespace(c)) map.merge(c, 1, Integer::sum);
        for (var e : map.entrySet()) if (e.getValue() == 1) return e.getKey();
        return null;
    }
}
