def combination_sum(candidates, target):
    result = []
    candidates = sorted(set(candidates))

    def backtrack(start, remaining, path):
        if remaining == 0:
            result.append(path.copy())
            return
        for i in range(start, len(candidates)):
            value = candidates[i]
            if value > remaining:
                break
            path.append(value)
            backtrack(i, remaining - value, path)
            path.pop()

    backtrack(0, target, [])
    return result

if __name__ == "__main__":
    print(combination_sum([2,3,6,7], 7))
