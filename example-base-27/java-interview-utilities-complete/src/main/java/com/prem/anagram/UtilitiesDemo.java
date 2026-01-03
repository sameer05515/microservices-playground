package com.prem.anagram;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
public class UtilitiesDemo {
    public static void main(String[] args) {
        System.out.println("=== Anagram ===");
        System.out.println(SortingAnagramChecker.isAnagram("listen","silent"));
        System.out.println(HashMapAnagramChecker.isAnagram("listen","silent"));
        System.out.println(FrequencyArrayAnagramChecker.isAnagram("listen","silent"));

        System.out.println("\n=== String ===");
        System.out.println(PalindromeChecker.isPalindrome("madam"));
        System.out.println(StringReverser.reverse("hello"));
        System.out.println(CharacterFrequencyCounter.count("banana"));
        System.out.println(FirstNonRepeatingCharacter.find("swiss"));
        System.out.println(DuplicateCharactersFinder.find("programming"));
        System.out.println(VowelConsonantCounter.count("Interview"));
        System.out.println(WordCount.count("java spring java boot"));
        System.out.println(LongestWordFinder.find("Java Spring Boot Microservices"));

        System.out.println("\n=== Array ===");
        int[] a={1,2,3,4,2,5,3};
        System.out.println(ArrayDuplicatesFinder.find(a));
        System.out.println(SecondLargestFinder.find(a));
        System.out.println(Arrays.toString(TwoSum.find(new int[]{2,7,11,15},9)));
        System.out.println(ArrayIntersection.find(new int[]{1,2,3},new int[]{2,3,4}));
        System.out.println(MissingNumberFinder.findUsingSum(new int[]{3,0,1}));
        System.out.println(MissingNumberFinder.findUsingXor(new int[]{3,0,1}));
        int[] rotated={1,2,3,4,5}; ArrayRotation.rotateRight(rotated,2); System.out.println(Arrays.toString(rotated));
        System.out.println(MaxMinFinder.find(a));
        System.out.println(BinarySearch.search(new int[]{1,3,5,7,9},7));
        System.out.println(Arrays.toString(MergeSortedArrays.merge(new int[]{1,3,5},new int[]{2,4,6})));
        int[] sorted={1,1,2,2,3}; int length=RemoveDuplicatesFromSortedArray.remove(sorted);
        System.out.println(Arrays.toString(Arrays.copyOf(sorted,length)));

        System.out.println("\n=== Collections ===");
        List<Integer> values=List.of(1,2,2,3,3,3);
        System.out.println(ListDuplicatesFinder.find(values));
        System.out.println(ListFrequencyCounter.count(values));
        System.out.println(MapSorter.sortByValue(Map.of("A",30,"B",10,"C",20)));

        System.out.println("\n=== Number ===");
        System.out.println(PrimeChecker.isPrime(29));
        System.out.println(FibonacciGenerator.generate(10));
        System.out.println(FactorialCalculator.calculate(5));
        System.out.println(ArmstrongNumberChecker.isArmstrong(153));
        System.out.println(PalindromeNumberChecker.isPalindrome(12321));
        System.out.println(ReverseInteger.reverse(12345));

        System.out.println("\n=== Stack ===");
        System.out.println(BalancedBracketsChecker.isBalanced("{[()]}"));
    }
}
