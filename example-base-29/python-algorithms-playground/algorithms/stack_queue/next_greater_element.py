def next_greater_elements(nums):
    result = [-1] * len(nums)
    stack = []
    for i, value in enumerate(nums):
        while stack and nums[stack[-1]] < value:
            result[stack.pop()] = value
        stack.append(i)
    return result

if __name__ == "__main__":
    print(next_greater_elements([4, 5, 2, 10, 8]))
