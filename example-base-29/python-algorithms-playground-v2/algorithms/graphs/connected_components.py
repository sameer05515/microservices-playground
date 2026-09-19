def count_components(n,edges):
    g=[[] for _ in range(n)]
    for a,b in edges: g[a].append(b); g[b].append(a)
    seen=set(); count=0
    def dfs(x):
        seen.add(x)
        for y in g[x]:
            if y not in seen: dfs(y)
    for x in range(n):
        if x not in seen: count+=1; dfs(x)
    return count
if __name__ == "__main__": print(count_components(5,[(0,1),(1,2),(3,4)]))
