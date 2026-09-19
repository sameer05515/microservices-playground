def heap_sort(arr):
    a = arr.copy()
    n = len(a)

    def heapify(size, root):
        largest = root
        left, right = 2 * root + 1, 2 * root + 2
        if left < size and a[left] > a[largest]:
            largest = left
        if right < size and a[right] > a[largest]:
            largest = right
        if largest != root:
            a[root], a[largest] = a[largest], a[root]
            heapify(size, largest)

    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    for end in range(n - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        heapify(end, 0)
    return a

if __name__ == "__main__":
    print(heap_sort([12, 11, 13, 5, 6, 7]))
