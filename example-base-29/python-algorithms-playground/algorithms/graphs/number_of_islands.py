def num_islands(grid):
    if not grid:
        return 0
    rows, cols, count = len(grid), len(grid[0]), 0
    grid = [row.copy() for row in grid]

    def flood(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        flood(r+1,c); flood(r-1,c); flood(r,c+1); flood(r,c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                flood(r, c)
    return count

if __name__ == "__main__":
    grid = [["1","1","0"],["1","0","0"],["0","0","1"]]
    print(num_islands(grid))
