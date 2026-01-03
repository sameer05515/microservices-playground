def rob(nums):
    previous, current = 0, 0
    for value in nums:
        previous, current = current, max(current, previous + value)
    return current

if __name__ == "__main__":
    print(rob([2,7,9,3,1]))
