package com.prem.anagram;
import java.util.*;
public class StreamFilterSort {public static List<Integer> evenSorted(List<Integer>values){return values.stream().filter(x->x%2==0).sorted().toList();}}
