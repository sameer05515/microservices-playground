package com.prem.anagram;
import java.util.ArrayDeque;import java.util.Deque;
public class QueueUsingTwoStacks {private final Deque<Integer>in=new ArrayDeque<>(),out=new ArrayDeque<>();public void offer(int x){in.push(x);}public int poll(){move();if(out.isEmpty())throw new IllegalStateException("Queue empty");return out.pop();}private void move(){if(out.isEmpty())while(!in.isEmpty())out.push(in.pop());}}
