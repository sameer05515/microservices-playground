package com.prem.anagram;
public class FrequencyArrayAnagramChecker {
    private static final int ASCII_SIZE = 256;
    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) return false;
        String s1 = normalize(first), s2 = normalize(second);
        if (s1.length() != s2.length()) return false;
        int[] frequency = new int[ASCII_SIZE];
        for (int i = 0; i < s1.length(); i++) {
            if (s1.charAt(i) >= ASCII_SIZE || s2.charAt(i) >= ASCII_SIZE) return false;
            frequency[s1.charAt(i)]++;
            frequency[s2.charAt(i)]--;
        }
        for (int count : frequency) if (count != 0) return false;
        return true;
    }
    private static String normalize(String s) { return s.replaceAll("\\s+", "").toLowerCase(); }
}
