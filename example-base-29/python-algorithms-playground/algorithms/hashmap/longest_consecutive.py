def longest_consecutive(nums):
    values = set(nums)
    best = 0
    for value in values:
        if value - 1 not in values:
            length = 1
            while value + length in values:
                length += 1
            best = max(best, length)
    return best

if __name__ == "__main__":
    print(longest_consecutive([100,4,200,1,3,2]))
