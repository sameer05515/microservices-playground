package com.prem.anagram;
import java.util.Arrays;
public class SortingAnagramChecker {
    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) return false;
        String s1 = normalize(first), s2 = normalize(second);
        if (s1.length() != s2.length()) return false;
        char[] a = s1.toCharArray(), b = s2.toCharArray();
        Arrays.sort(a); Arrays.sort(b);
        return Arrays.equals(a, b);
    }
    private static String normalize(String s) { return s.replaceAll("\\s+", "").toLowerCase(); }
}
