package com.prem.anagram;
import java.util.*;
public class InterviewUtilities {
 public static boolean palindrome(String s){if(s==null)return false;s=s.replaceAll("\\s+","").toLowerCase();for(int i=0,j=s.length()-1;i<j;i++,j--)if(s.charAt(i)!=s.charAt(j))return false;return true;}
 public static String reverse(String s){return s==null?null:new StringBuilder(s).reverse().toString();}
 public static Map<Character,Integer> charFrequency(String s){Map<Character,Integer> m=new HashMap<>();if(s!=null)for(char c:s.toLowerCase().toCharArray())if(!Character.isWhitespace(c))m.merge(c,1,Integer::sum);return m;}
 public static Character firstNonRepeating(String s){Map<Character,Integer> m=new LinkedHashMap<>(charFrequency(s));for(var e:m.entrySet())if(e.getValue()==1)return e.getKey();return null;}
 public static Set<Character> duplicateCharacters(String s){Set<Character> seen=new HashSet<>(),d=new LinkedHashSet<>();if(s!=null)for(char c:s.toLowerCase().toCharArray())if(!Character.isWhitespace(c)&&!seen.add(c))d.add(c);return d;}
 public static int[] twoSum(int[] a,int target){Map<Integer,Integer> m=new HashMap<>();for(int i=0;i<a.length;i++){if(m.containsKey(target-a[i]))return new int[]{m.get(target-a[i]),i};m.put(a[i],i);}return new int[0];}
 public static Integer secondLargest(int[] a){Integer max=null,second=null;for(int n:a){if(max==null||n>max){second=max;max=n;}else if(n!=max&&(second==null||n>second))second=n;}return second;}
 public static int missingNumber(int[] a){int x=a.length;for(int i=0;i<a.length;i++)x^=i^a[i];return x;}
 public static void rotateRight(int[] a,int k){if(a==null||a.length==0)return;k%=a.length;rev(a,0,a.length-1);rev(a,0,k-1);rev(a,k,a.length-1);} private static void rev(int[]a,int i,int j){while(i<j){int t=a[i];a[i++]=a[j];a[j--]=t;}}
 public static boolean isPrime(int n){if(n<2)return false;for(int i=2;(long)i*i<=n;i++)if(n%i==0)return false;return true;}
 public static long factorial(int n){if(n<0)throw new IllegalArgumentException("n must be >= 0");long r=1;for(int i=2;i<=n;i++)r*=i;return r;}
 public static List<Long> fibonacci(int n){List<Long> r=new ArrayList<>();long a=0,b=1;for(int i=0;i<n;i++){r.add(a);long t=a+b;a=b;b=t;}return r;}
 public static boolean palindromeNumber(int n){if(n<0)return false;int x=n,r=0;while(n>0){r=r*10+n%10;n/=10;}return x==r;}
 public static boolean armstrong(int n){if(n<0)return false;int x=n,d=String.valueOf(n).length(),sum=0;do{sum+=(int)Math.pow(n%10,d);n/=10;}while(n>0);return x==sum;}
}
