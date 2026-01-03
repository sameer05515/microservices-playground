from dataclasses import dataclass
@dataclass
class Node: value:int; next:object=None
def remove_nth_from_end(head,n):
    dummy=Node(0,head); slow=fast=dummy
    for _ in range(n): fast=fast.next
    while fast.next: slow=slow.next; fast=fast.next
    slow.next=slow.next.next
    return dummy.next
def to_list(head):
    out=[]
    while head: out.append(head.value); head=head.next
    return out
if __name__ == "__main__": print(to_list(remove_nth_from_end(Node(1,Node(2,Node(3,Node(4,Node(5))))),2)))
