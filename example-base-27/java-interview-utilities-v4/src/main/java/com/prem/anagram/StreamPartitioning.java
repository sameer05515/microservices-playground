package com.prem.anagram;
import java.util.*;import java.util.stream.Collectors;
public class StreamPartitioning {public static Map<Boolean,List<Integer>> partitionEvenOdd(List<Integer>v){return v.stream().collect(Collectors.partitioningBy(x->x%2==0));}}
