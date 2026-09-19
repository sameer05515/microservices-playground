def search_insert(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid=(left+right)//2
        if nums[mid] < target: left=mid+1
        else: right=mid
    return left

if __name__ == "__main__":
    print(search_insert([1,3,5,6], 2))
