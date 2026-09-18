package com.prem.anagram;
import java.util.HashMap;
import java.util.Map;
public class TwoSum {
    public static int[] find(int[] numbers,int target) {
        if(numbers==null) return new int[0];
        Map<Integer,Integer> map=new HashMap<>();
        for(int i=0;i<numbers.length;i++) {
            int complement=target-numbers[i];
            if(map.containsKey(complement)) return new int[]{map.get(complement),i};
            map.put(numbers[i],i);
        }
        return new int[0];
    }
}
