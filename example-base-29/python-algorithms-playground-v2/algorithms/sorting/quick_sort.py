def quick_sort(arr):
    a = arr.copy()

    def partition(low, high):
        pivot = a[high]
        i = low
        for j in range(low, high):
            if a[j] <= pivot:
                a[i], a[j] = a[j], a[i]
                i += 1
        a[i], a[high] = a[high], a[i]
        return i

    def sort(low, high):
        if low < high:
            p = partition(low, high)
            sort(low, p - 1)
            sort(p + 1, high)

    sort(0, len(a) - 1)
    return a

if __name__ == "__main__":
    print(quick_sort([10, 7, 8, 9, 1, 5]))
