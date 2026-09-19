def dfs(graph, start):
    visited, order = set(), []
    def visit(node):
        if node in visited:
            return
        visited.add(node)
        order.append(node)
        for neighbor in graph.get(node, []):
            visit(neighbor)
    visit(start)
    return order

if __name__ == "__main__":
    graph = {"A":["B","C"], "B":["D"], "C":["E"], "D":[], "E":[]}
    print(dfs(graph, "A"))
