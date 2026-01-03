def counting_sort(arr):
    if not arr:
        return []
    if min(arr) < 0:
        raise ValueError("This implementation expects non-negative integers.")
    counts = [0] * (max(arr) + 1)
    for value in arr:
        counts[value] += 1
    result = []
    for value, count in enumerate(counts):
        result.extend([value] * count)
    return result

if __name__ == "__main__":
    print(counting_sort([4, 2, 2, 8, 3, 3, 1]))
