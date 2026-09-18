package com.prem.anagram;
public class StrategyPattern {interface Strategy{int execute(int a,int b);}static class Add implements Strategy{public int execute(int a,int b){return a+b;}}static class Multiply implements Strategy{public int execute(int a,int b){return a*b;}}public static int calculate(Strategy s,int a,int b){return s.execute(a,b);}}
