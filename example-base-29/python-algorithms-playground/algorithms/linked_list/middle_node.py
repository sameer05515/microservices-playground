from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    value: int
    next: Optional["Node"] = None

def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

if __name__ == "__main__":
    head = Node(1, Node(2, Node(3, Node(4, Node(5)))))
    print(middle_node(head).value)
