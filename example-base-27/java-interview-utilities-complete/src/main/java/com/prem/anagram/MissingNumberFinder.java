package com.prem.anagram;
public class MissingNumberFinder {
    public static int findUsingSum(int[] numbers) {
        int n=numbers.length; long expected=(long)n*(n+1)/2, actual=0;
        for(int x:numbers) actual+=x;
        return (int)(expected-actual);
    }
    public static int findUsingXor(int[] numbers) {
        int result=numbers.length;
        for(int i=0;i<numbers.length;i++) result ^= i ^ numbers[i];
        return result;
    }
}
