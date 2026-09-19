def lowest_common_ancestor(root,p,q):
    while root:
        if p<root.value and q<root.value: root=root.left
        elif p>root.value and q>root.value: root=root.right
        else: return root
    return None
if __name__ == "__main__":
    from binary_tree_traversals import Node
    print(lowest_common_ancestor(Node(6,Node(2,Node(0),Node(4)),Node(8)),0,4).value)
