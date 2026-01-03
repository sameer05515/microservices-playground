package com.p.jsp;

public class SinglyLinkedListOld {
    private static class Node{
        public String getData() {
            return data;
        }

        public void setData(String data) {
            this.data = data;
        }

        String data;

        public Node getNext() {
            return next;
        }

        public void setNext(Node next) {
            this.next = next;
        }

        Node next;

        public Node(String data, Node next) {
            this.data = data;
            this.next = next;
        }

        @Override
        public String toString() {
            return "Node{" +
                    "data='" + data + '\'' +
                    ", next=" + next +
                    '}';
        }
    }


    public static void main(String[] args) {
        Node start=new Node("a",null);
        Node b=new Node("b",null);
        Node c=new Node("c",null);

        start.setNext(b);
        b.setNext(c);


        System.out.println(start);

        // finding middle node
        Node next=start;

        int count=1;
        while(next!=null){
            count++;
            next=next.getNext();
        }

        Node middle=start;
        for(int i=0;i<count/2+1;i++){
            middle=middle.getNext();
        }

        System.out.println(middle);


    }
}
