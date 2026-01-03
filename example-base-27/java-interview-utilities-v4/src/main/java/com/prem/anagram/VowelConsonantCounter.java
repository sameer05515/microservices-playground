package com.prem.anagram;
public class VowelConsonantCounter { public record Result(int vowels,int consonants){} public static Result count(String s){int v=0,c=0;if(s!=null)for(char x:s.toLowerCase().toCharArray())if(x>='a'&&x<='z'){if("aeiou".indexOf(x)>=0)v++;else c++;}return new Result(v,c);} }
