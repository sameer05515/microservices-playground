def subsets(nums):
    result = []
    def backtrack(index, path):
        if index == len(nums):
            result.append(path.copy())
            return
        backtrack(index + 1, path)
        path.append(nums[index])
        backtrack(index + 1, path)
        path.pop()
    backtrack(0, [])
    return result

if __name__ == "__main__":
    print(subsets([1,2,3]))
