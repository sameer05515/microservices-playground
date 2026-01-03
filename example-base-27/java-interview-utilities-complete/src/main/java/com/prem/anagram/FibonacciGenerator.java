package com.prem.anagram;
import java.util.ArrayList;
import java.util.List;
public class FibonacciGenerator {
    public static List<Long> generate(int count) {
        List<Long> result=new ArrayList<>();
        long a=0,b=1;
        for(int i=0;i<count;i++){result.add(a);long next=a+b;a=b;b=next;}
        return result;
    }
}
