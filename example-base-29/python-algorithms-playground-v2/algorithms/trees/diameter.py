def diameter(root):
    best=0
    def height(node):
        nonlocal best
        if not node: return 0
        l,r=height(node.left),height(node.right); best=max(best,l+r); return 1+max(l,r)
    height(root); return best
if __name__ == "__main__":
    from binary_tree_traversals import Node
    print(diameter(Node(1,Node(2,Node(4),Node(5)),Node(3))))
