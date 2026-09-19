def permutations(nums):
    result = []
    def backtrack(path, remaining):
        if not remaining:
            result.append(path.copy())
            return
        for i, value in enumerate(remaining):
            backtrack(path + [value], remaining[:i] + remaining[i+1:])
    backtrack([], nums)
    return result

if __name__ == "__main__":
    print(permutations([1,2,3]))
