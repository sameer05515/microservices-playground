package com.prem.anagram;
import java.util.HashMap;import java.util.Map;
public class TwoSum { public static int[] find(int[]a,int target){if(a==null)return new int[0];Map<Integer,Integer>m=new HashMap<>();for(int i=0;i<a.length;i++){int c=target-a[i];if(m.containsKey(c))return new int[]{m.get(c),i};m.put(a[i],i);}return new int[0];} }
