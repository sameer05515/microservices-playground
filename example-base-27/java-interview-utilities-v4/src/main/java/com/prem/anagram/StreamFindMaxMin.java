package com.prem.anagram;
import java.util.*;
public class StreamFindMaxMin {public static OptionalInt max(List<Integer>v){return v.stream().mapToInt(Integer::intValue).max();}public static OptionalInt min(List<Integer>v){return v.stream().mapToInt(Integer::intValue).min();}}
