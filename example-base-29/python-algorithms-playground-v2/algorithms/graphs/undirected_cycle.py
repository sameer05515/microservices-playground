def has_cycle(graph):
    seen=set()
    def dfs(node,parent):
        seen.add(node)
        for n in graph.get(node,[]):
            if n not in seen:
                if dfs(n,node): return True
            elif n!=parent: return True
        return False
    return any(node not in seen and dfs(node,None) for node in graph)
if __name__ == "__main__": print(has_cycle({0:[1],1:[0,2],2:[1,3],3:[2,0]}))
