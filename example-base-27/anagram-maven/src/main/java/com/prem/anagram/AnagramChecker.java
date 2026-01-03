package com.prem.anagram;

import java.util.Arrays;

public class AnagramChecker {

    public static boolean isAnagram(String first, String second) {
        if (first == null || second == null) {
            return false;
        }

        String s1 = first.replaceAll("\\s+", "").toLowerCase();
        String s2 = second.replaceAll("\\s+", "").toLowerCase();

        if (s1.length() != s2.length()) {
            return false;
        }

        char[] chars1 = s1.toCharArray();
        char[] chars2 = s2.toCharArray();

        Arrays.sort(chars1);
        Arrays.sort(chars2);

        return Arrays.equals(chars1, chars2);
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // true
        System.out.println(isAnagram("hello", "world"));   // false
        System.out.println(isAnagram("Dormitory", "Dirty room")); // true
    }
}
