package com.prem.anagram;
import java.util.LinkedHashSet;
import java.util.Set;
public class DuplicateCharactersFinder {
    public static Set<Character> find(String input) {
        Set<Character> seen = new LinkedHashSet<>(), duplicates = new LinkedHashSet<>();
        if (input == null) return duplicates;
        for (char c : input.toLowerCase().toCharArray())
            if (!Character.isWhitespace(c) && !seen.add(c)) duplicates.add(c);
        return duplicates;
    }
}
