package com.prem.anagram;
public class PalindromeChecker {
    public static boolean isPalindrome(String input) {
        if (input == null) return false;
        String s = input.replaceAll("\\s+", "").toLowerCase();
        int left = 0, right = s.length() - 1;
        while (left < right) if (s.charAt(left++) != s.charAt(right--)) return false;
        return true;
    }
}
