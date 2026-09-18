package com.prem.anagram;
public class RemoveDuplicatesFromSortedArray {
    public static int remove(int[] numbers) {
        if(numbers==null || numbers.length==0) return 0;
        int write=1;
        for(int read=1;read<numbers.length;read++)
            if(numbers[read]!=numbers[read-1]) numbers[write++]=numbers[read];
        return write;
    }
}
