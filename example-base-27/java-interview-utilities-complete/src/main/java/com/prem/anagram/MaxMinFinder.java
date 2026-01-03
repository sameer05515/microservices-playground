package com.prem.anagram;
public class MaxMinFinder {
    public record Result(int min,int max) {}
    public static Result find(int[] numbers) {
        if(numbers==null || numbers.length==0) throw new IllegalArgumentException("Array must not be empty");
        int min=numbers[0],max=numbers[0];
        for(int n:numbers){if(n<min)min=n;if(n>max)max=n;}
        return new Result(min,max);
    }
}
