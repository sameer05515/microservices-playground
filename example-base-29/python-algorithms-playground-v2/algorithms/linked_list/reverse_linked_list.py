from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    value: int
    next: Optional["Node"] = None

def reverse(head):
    previous = None
    current = head
    while current:
        nxt = current.next
        current.next = previous
        previous, current = current, nxt
    return previous

def to_list(head):
    result = []
    while head:
        result.append(head.value)
        head = head.next
    return result

if __name__ == "__main__":
    head = Node(1, Node(2, Node(3)))
    print(to_list(reverse(head)))
