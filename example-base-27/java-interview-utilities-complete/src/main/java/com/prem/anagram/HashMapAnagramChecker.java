package com.prem.anagram;
import java.util.HashMap;
import java.util.Map;
public class HashMapAnagramChecker {
    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) return false;
        String s1 = normalize(first), s2 = normalize(second);
        if (s1.length() != s2.length()) return false;
        Map<Character,Integer> map = new HashMap<>();
        for (char c : s1.toCharArray()) map.merge(c, 1, Integer::sum);
        for (char c : s2.toCharArray()) {
            Integer count = map.get(c);
            if (count == null) return false;
            if (count == 1) map.remove(c); else map.put(c, count - 1);
        }
        return map.isEmpty();
    }
    private static String normalize(String s) { return s.replaceAll("\\s+", "").toLowerCase(); }
}
