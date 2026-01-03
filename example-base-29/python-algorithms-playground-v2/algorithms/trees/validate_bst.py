def is_valid_bst(root, low=float("-inf"), high=float("inf")):
    if not root:
        return True
    if not (low < root.value < high):
        return False
    return is_valid_bst(root.left, low, root.value) and is_valid_bst(root.right, root.value, high)

if __name__ == "__main__":
    from binary_tree_traversals import Node
    root = Node(2, Node(1), Node(3))
    print(is_valid_bst(root))
