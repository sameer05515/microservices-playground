package com.prem.anagram;
public class BinaryTreeHeight {public static class Node{public int data;public Node left,right;public Node(int d){data=d;}}public static int height(Node n){return n==null?0:1+Math.max(height(n.left),height(n.right));}}
