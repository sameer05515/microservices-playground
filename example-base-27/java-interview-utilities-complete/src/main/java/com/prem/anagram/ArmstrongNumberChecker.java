package com.prem.anagram;
public class ArmstrongNumberChecker {
    public static boolean isArmstrong(int number) {
        if(number<0) return false;
        int original=number, digits=String.valueOf(number).length(), sum=0;
        do { int digit=number%10; sum+=(int)Math.pow(digit,digits); number/=10; }
        while(number>0);
        return sum==original;
    }
}
