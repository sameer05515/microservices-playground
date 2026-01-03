def word_exists(board,word):
    rows,cols=len(board),len(board[0])
    def dfs(r,c,i):
        if i==len(word): return True
        if not(0<=r<rows and 0<=c<cols) or board[r][c]!=word[i]: return False
        old=board[r][c]; board[r][c]='#'
        ok=any(dfs(r+dr,c+dc,i+1) for dr,dc in ((1,0),(-1,0),(0,1),(0,-1)))
        board[r][c]=old; return ok
    return any(dfs(r,c,0) for r in range(rows) for c in range(cols))
if __name__ == "__main__": print(word_exists([['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'ABCCED'))
