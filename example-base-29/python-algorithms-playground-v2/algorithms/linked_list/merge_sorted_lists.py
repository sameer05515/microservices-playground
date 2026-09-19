from dataclasses import dataclass
@dataclass
class Node: value:int; next:object=None
def merge_lists(a,b):
    dummy=Node(0); tail=dummy
    while a and b:
        if a.value<=b.value: tail.next=a; a=a.next
        else: tail.next=b; b=b.next
        tail=tail.next
    tail.next=a or b
    return dummy.next
def to_list(head):
    out=[]
    while head: out.append(head.value); head=head.next
    return out
if __name__ == "__main__": print(to_list(merge_lists(Node(1,Node(3,Node(5))),Node(2,Node(4,Node(6))))))
