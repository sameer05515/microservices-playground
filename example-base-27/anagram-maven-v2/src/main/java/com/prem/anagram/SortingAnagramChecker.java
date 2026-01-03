package com.prem.anagram;

import java.util.Arrays;

/**
 * Anagram check using sorting.
 *
 * Time:  O(n log n)
 * Space: O(n)
 */
public class SortingAnagramChecker {

    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) {
            return false;
        }

        String s1 = normalize(first);
        String s2 = normalize(second);

        if (s1.length() != s2.length()) {
            return false;
        }

        char[] chars1 = s1.toCharArray();
        char[] chars2 = s2.toCharArray();

        Arrays.sort(chars1);
        Arrays.sort(chars2);

        return Arrays.equals(chars1, chars2);
    }

    private static String normalize(String input) {
        return input.replaceAll("\\s+", "").toLowerCase();
    }
}
