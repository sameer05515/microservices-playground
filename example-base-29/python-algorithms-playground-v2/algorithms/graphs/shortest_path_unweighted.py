from collections import deque
def shortest_path(graph,start,target):
    q=deque([(start,[start])]); seen={start}
    while q:
        node,path=q.popleft()
        if node==target: return path
        for n in graph.get(node,[]):
            if n not in seen: seen.add(n); q.append((n,path+[n]))
    return []
if __name__ == "__main__": print(shortest_path({'A':['B','C'],'B':['A','D'],'C':['A','D'],'D':['B','C','E'],'E':['D']},'A','E'))
