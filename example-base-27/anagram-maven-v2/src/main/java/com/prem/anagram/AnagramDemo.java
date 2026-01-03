package com.prem.anagram;

public class AnagramDemo {

    public static void main(String[] args) {

        String first = "Dormitory";
        String second = "Dirty room";

        System.out.println("Input 1 : " + first);
        System.out.println("Input 2 : " + second);
        System.out.println();

        System.out.println(
                "Sorting             : " +
                SortingAnagramChecker.isAnagram(first, second)
        );

        System.out.println(
                "HashMap             : " +
                HashMapAnagramChecker.isAnagram(first, second)
        );

        System.out.println(
                "Frequency Array     : " +
                FrequencyArrayAnagramChecker.isAnagram(first, second)
        );
    }
}
