package com.prem.anagram;
public class LongestWordFinder {
    public static String find(String sentence) {
        if(sentence==null || sentence.isBlank()) return null;
        String longest="";
        for(String word:sentence.trim().split("\\s+"))
            if(word.length()>longest.length()) longest=word;
        return longest;
    }
}
