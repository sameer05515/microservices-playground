package com.prem.anagram;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
public class BalancedBracketsChecker {
    private static final Map<Character,Character> PAIRS=Map.of(')', '(', ']', '[', '}', '{');
    public static boolean isBalanced(String input) {
        if(input==null) return false;
        Deque<Character> stack=new ArrayDeque<>();
        for(char c:input.toCharArray()){
            if(c=='('||c=='['||c=='{') stack.push(c);
            else if(PAIRS.containsKey(c) && (stack.isEmpty() || stack.pop()!=PAIRS.get(c))) return false;
        }
        return stack.isEmpty();
    }
}
