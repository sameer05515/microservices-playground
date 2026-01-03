def move_zeroes(nums):
    a = nums.copy()
    insert = 0
    for value in a:
        if value != 0:
            a[insert] = value
            insert += 1
    while insert < len(a):
        a[insert] = 0
        insert += 1
    return a

if __name__ == "__main__":
    print(move_zeroes([0, 1, 0, 3, 12]))
