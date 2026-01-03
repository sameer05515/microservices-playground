def subarray_sum(nums, target):
    prefix_sum = 0
    first_index = {0: -1}
    for i, value in enumerate(nums):
        prefix_sum += value
        if prefix_sum - target in first_index:
            return [first_index[prefix_sum - target] + 1, i]
        first_index.setdefault(prefix_sum, i)
    return []

if __name__ == "__main__":
    print(subarray_sum([1,2,3,7,5], 12))
