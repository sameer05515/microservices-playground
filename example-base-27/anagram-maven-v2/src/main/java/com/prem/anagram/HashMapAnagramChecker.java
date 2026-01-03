package com.prem.anagram;

import java.util.HashMap;
import java.util.Map;

/**
 * Anagram check using HashMap character frequencies.
 *
 * Time:  O(n) average
 * Space: O(k), where k is the number of distinct characters.
 */
public class HashMapAnagramChecker {

    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) {
            return false;
        }

        String s1 = normalize(first);
        String s2 = normalize(second);

        if (s1.length() != s2.length()) {
            return false;
        }

        Map<Character, Integer> frequency = new HashMap<>();

        for (char c : s1.toCharArray()) {
            frequency.put(c, frequency.getOrDefault(c, 0) + 1);
        }

        for (char c : s2.toCharArray()) {
            Integer count = frequency.get(c);

            if (count == null) {
                return false;
            }

            if (count == 1) {
                frequency.remove(c);
            } else {
                frequency.put(c, count - 1);
            }
        }

        return frequency.isEmpty();
    }

    private static String normalize(String input) {
        return input.replaceAll("\\s+", "").toLowerCase();
    }
}
