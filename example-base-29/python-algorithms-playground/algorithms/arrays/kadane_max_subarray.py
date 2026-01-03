def max_subarray_sum(nums):
    if not nums:
        raise ValueError("nums must not be empty")
    current = best = nums[0]
    for value in nums[1:]:
        current = max(value, current + value)
        best = max(best, current)
    return best

if __name__ == "__main__":
    print(max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4]))
