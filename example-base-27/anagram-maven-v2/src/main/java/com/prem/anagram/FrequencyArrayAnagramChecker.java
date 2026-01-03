package com.prem.anagram;

/**
 * Anagram check using a frequency array.
 *
 * This implementation assumes ASCII input.
 *
 * Time:  O(n)
 * Space: O(1) because the array size is fixed at 256.
 */
public class FrequencyArrayAnagramChecker {

    private static final int ASCII_SIZE = 256;

    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) {
            return false;
        }

        String s1 = normalize(first);
        String s2 = normalize(second);

        if (s1.length() != s2.length()) {
            return false;
        }

        int[] frequency = new int[ASCII_SIZE];

        for (int i = 0; i < s1.length(); i++) {
            frequency[s1.charAt(i)]++;
            frequency[s2.charAt(i)]--;
        }

        for (int count : frequency) {
            if (count != 0) {
                return false;
            }
        }

        return true;
    }

    private static String normalize(String input) {
        return input.replaceAll("\\s+", "").toLowerCase();
    }
}
