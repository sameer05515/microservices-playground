package com.prem.anagram;
public class SecondLargestFinder {
    public static Integer find(int[] numbers) {
        if(numbers==null || numbers.length<2) return null;
        Integer largest=null, second=null;
        for(int n:numbers) {
            if(largest==null || n>largest) { second=largest; largest=n; }
            else if(n!=largest && (second==null || n>second)) second=n;
        }
        return second;
    }
}
