def two_sum(nums, target):
    seen = {}
    for i, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return [seen[complement], i]
        seen[value] = i
    return []

if __name__ == "__main__":
    print(two_sum([2, 7, 11, 15], 9))
