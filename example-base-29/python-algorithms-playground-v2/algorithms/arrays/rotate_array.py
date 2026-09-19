def rotate(nums, k):
    if not nums:
        return []
    k %= len(nums)
    return nums[-k:] + nums[:-k] if k else nums.copy()

if __name__ == "__main__":
    print(rotate([1,2,3,4,5,6,7], 3))
