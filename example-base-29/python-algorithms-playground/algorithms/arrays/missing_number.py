def missing_number(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)

if __name__ == "__main__":
    print(missing_number([3, 0, 1]))
