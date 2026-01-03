def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1

if __name__ == "__main__":
    print(linear_search([10, 20, 30, 40], 30))  # 2
