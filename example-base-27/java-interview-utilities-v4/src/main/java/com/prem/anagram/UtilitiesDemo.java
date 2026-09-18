package com.prem.anagram;
import java.util.*;
public class UtilitiesDemo {
 public static void main(String[] args) {
  System.out.println("Anagram: "+FrequencyArrayAnagramChecker.isAnagram("listen","silent"));
  System.out.println("Palindrome: "+PalindromeChecker.isPalindrome("madam"));
  System.out.println("Two Sum: "+Arrays.toString(TwoSum.find(new int[]{2,7,11,15},9)));
  System.out.println("Prime: "+PrimeChecker.isPrime(29));
  System.out.println("Binary Search: "+BinarySearch.search(new int[]{1,3,5,7},5));
  System.out.println("Balanced Brackets: "+BalancedBracketsChecker.isBalanced("{[()]}"));
  System.out.println("BST search: "+BinarySearchTree.search(BinarySearchTree.insert(null,10),10));
  System.out.println("Kth largest: "+KthLargestElement.find(new int[]{3,2,1,5,6,4},2));
  System.out.println("Climbing stairs: "+ClimbingStairs.ways(5));
  System.out.println("LCS: "+LongestCommonSubsequence.length("abcde","ace"));
  System.out.println("Stream even sorted: "+StreamFilterSort.evenSorted(List.of(5,2,4,1,6)));
  System.out.println("Strategy add: "+StrategyPattern.calculate(new StrategyPattern.Add(),2,3));
 }
}
