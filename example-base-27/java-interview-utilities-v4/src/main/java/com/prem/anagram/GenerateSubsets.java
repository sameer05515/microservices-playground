package com.prem.anagram;
import java.util.*;
public class GenerateSubsets {public static List<List<Integer>> generate(int[]a){List<List<Integer>>r=new ArrayList<>();backtrack(a,0,new ArrayList<>(),r);return r;}private static void backtrack(int[]a,int i,List<Integer>cur,List<List<Integer>>r){if(i==a.length){r.add(new ArrayList<>(cur));return;}backtrack(a,i+1,cur,r);cur.add(a[i]);backtrack(a,i+1,cur,r);cur.remove(cur.size()-1);}}
