def solve_maze(maze):
    n=len(maze); result=[]; path=[[0]*n for _ in range(n)]
    def bt(r,c):
        if r==n-1 and c==n-1: result.append([row[:] for row in path]); return
        if not(0<=r<n and 0<=c<n) or maze[r][c]==0 or path[r][c]: return
        path[r][c]=1
        for dr,dc in ((1,0),(0,1),(-1,0),(0,-1)): bt(r+dr,c+dc)
        path[r][c]=0
    if n and maze[0][0] and maze[-1][-1]: bt(0,0)
    return result
if __name__ == "__main__": print(len(solve_maze([[1,0,0,0],[1,1,0,1],[0,1,0,0],[1,1,1,1]])))
