package com.prem.anagram;
public class VowelConsonantCounter {
    public record Result(int vowels, int consonants) {}
    public static Result count(String input) {
        if (input == null) return new Result(0,0);
        int v=0,c=0;
        for (char ch : input.toLowerCase().toCharArray()) {
            if (ch >= 'a' && ch <= 'z') {
                if ("aeiou".indexOf(ch) >= 0) v++; else c++;
            }
        }
        return new Result(v,c);
    }
}
