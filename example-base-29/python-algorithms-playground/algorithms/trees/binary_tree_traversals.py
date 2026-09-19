from dataclasses import dataclass
from collections import deque

@dataclass
class Node:
    value: int
    left: "Node | None" = None
    right: "Node | None" = None

def preorder(root):
    if not root:
        return []
    return [root.value] + preorder(root.left) + preorder(root.right)

def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.value] + inorder(root.right)

def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.value]

def level_order(root):
    if not root:
        return []
    result, q = [], deque([root])
    while q:
        node = q.popleft()
        result.append(node.value)
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return result

if __name__ == "__main__":
    root = Node(1, Node(2), Node(3))
    print(preorder(root))
    print(inorder(root))
    print(postorder(root))
    print(level_order(root))
