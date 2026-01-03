def count_subarrays(nums, k):
    prefix = 0
    count = 0
    frequencies = {0: 1}
    for value in nums:
        prefix += value
        count += frequencies.get(prefix - k, 0)
        frequencies[prefix] = frequencies.get(prefix, 0) + 1
    return count

if __name__ == "__main__":
    print(count_subarrays([1,1,1], 2))
