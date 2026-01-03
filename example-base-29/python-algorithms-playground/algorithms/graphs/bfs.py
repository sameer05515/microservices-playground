from collections import deque

def bfs(graph, start):
    visited = {start}
    order = []
    q = deque([start])
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                q.append(neighbor)
    return order

if __name__ == "__main__":
    graph = {"A":["B","C"], "B":["D"], "C":["E"], "D":[], "E":[]}
    print(bfs(graph, "A"))
