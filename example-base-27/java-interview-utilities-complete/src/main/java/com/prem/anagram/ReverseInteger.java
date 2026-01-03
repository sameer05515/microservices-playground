package com.prem.anagram;
public class ReverseInteger {
    public static int reverse(int number) {
        long result=0;
        while(number!=0){result=result*10+number%10;number/=10;}
        if(result>Integer.MAX_VALUE || result<Integer.MIN_VALUE) return 0;
        return (int)result;
    }
}
