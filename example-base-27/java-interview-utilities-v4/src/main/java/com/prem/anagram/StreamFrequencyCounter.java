package com.prem.anagram;
import java.util.*;import java.util.function.Function;import java.util.stream.Collectors;
public class StreamFrequencyCounter {public static Map<String,Long> count(List<String>values){return values.stream().collect(Collectors.groupingBy(Function.identity(),LinkedHashMap::new,Collectors.counting()));}}
