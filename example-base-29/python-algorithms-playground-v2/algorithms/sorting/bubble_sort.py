def bubble_sort(arr):
    a = arr.copy()
    for i in range(len(a)):
        swapped = False
        for j in range(0, len(a) - i - 1):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a

if __name__ == "__main__":
    print(bubble_sort([5, 1, 4, 2, 8]))
