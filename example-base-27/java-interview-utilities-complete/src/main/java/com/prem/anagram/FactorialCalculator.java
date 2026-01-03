package com.prem.anagram;
public class FactorialCalculator {
    public static long calculate(int n) {
        if(n<0) throw new IllegalArgumentException("n must be >= 0");
        long result=1;
        for(int i=2;i<=n;i++) result*=i;
        return result;
    }
}
