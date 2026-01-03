def first_occurrence(arr, target):
    left, right, answer = 0, len(arr) - 1, -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            answer = mid
            right = mid - 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return answer

def last_occurrence(arr, target):
    left, right, answer = 0, len(arr) - 1, -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            answer = mid
            left = mid + 1
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return answer

if __name__ == "__main__":
    a = [1, 2, 2, 2, 4, 5]
    print(first_occurrence(a, 2), last_occurrence(a, 2))
