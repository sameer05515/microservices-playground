from dataclasses import dataclass
from typing import Optional

@dataclass
class Node:
    value: int
    next: Optional["Node"] = None

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

if __name__ == "__main__":
    a, b, c = Node(1), Node(2), Node(3)
    a.next, b.next, c.next = b, c, b
    print(has_cycle(a))
