package com.prem.anagram;
public class StringReverser {
    public static String reverse(String input) {
        return input == null ? null : new StringBuilder(input).reverse().toString();
    }
}
