package com.prem.anagram;
import java.util.*;
public class LevelOrderTraversal {public static class Node{public int data;public Node left,right;public Node(int d){data=d;}}public static List<Integer> traverse(Node root){List<Integer>r=new ArrayList<>();if(root==null)return r;Queue<Node>q=new ArrayDeque<>();q.offer(root);while(!q.isEmpty()){Node n=q.poll();r.add(n.data);if(n.left!=null)q.offer(n.left);if(n.right!=null)q.offer(n.right);}return r;}}
