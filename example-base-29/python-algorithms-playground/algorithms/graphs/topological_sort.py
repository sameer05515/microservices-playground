from collections import deque

def topological_sort(graph):
    indegree = {node: 0 for node in graph}
    for node in graph:
        for neighbor in graph[node]:
            indegree[neighbor] = indegree.get(neighbor, 0) + 1
    q = deque(node for node, degree in indegree.items() if degree == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                q.append(neighbor)
    if len(order) != len(indegree):
        raise ValueError("Graph contains a cycle")
    return order

if __name__ == "__main__":
    graph = {"A":["C"], "B":["C","D"], "C":["E"], "D":["F"], "E":["F"], "F":[]}
    print(topological_sort(graph))
