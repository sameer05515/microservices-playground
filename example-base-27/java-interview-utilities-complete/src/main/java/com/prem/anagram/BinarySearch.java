package com.prem.anagram;
public class BinarySearch {
    public static int search(int[] sortedNumbers,int target) {
        if(sortedNumbers==null) return -1;
        int left=0,right=sortedNumbers.length-1;
        while(left<=right){
            int mid=left+(right-left)/2;
            if(sortedNumbers[mid]==target)return mid;
            if(sortedNumbers[mid]<target)left=mid+1;else right=mid-1;
        }
        return -1;
    }
}
