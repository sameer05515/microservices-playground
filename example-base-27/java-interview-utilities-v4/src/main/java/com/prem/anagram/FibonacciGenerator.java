package com.prem.anagram;
import java.util.ArrayList;import java.util.List;
public class FibonacciGenerator { public static List<Long> generate(int n){List<Long>r=new ArrayList<>();long a=0,b=1;for(int i=0;i<n;i++){r.add(a);long x=a+b;a=b;b=x;}return r;} }
