package com.prem.anagram;
public class PalindromeNumberChecker {
    public static boolean isPalindrome(int number) {
        if(number<0) return false;
        int original=number,reversed=0;
        while(number>0){reversed=reversed*10+number%10;number/=10;}
        return original==reversed;
    }
}
