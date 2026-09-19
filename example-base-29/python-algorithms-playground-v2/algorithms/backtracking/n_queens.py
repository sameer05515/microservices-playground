def solve_n_queens(n):
    solutions = []
    cols, diag1, diag2 = set(), set(), set()
    board = [["."] * n for _ in range(n)]

    def backtrack(row):
        if row == n:
            solutions.append(["".join(r) for r in board])
            return
        for col in range(n):
            if col in cols or row - col in diag1 or row + col in diag2:
                continue
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            board[row][col] = "Q"
            backtrack(row + 1)
            board[row][col] = "."
            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)

    backtrack(0)
    return solutions

if __name__ == "__main__":
    print(len(solve_n_queens(4)))
