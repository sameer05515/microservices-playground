from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, value):
        self._items.append(value)

    def dequeue(self):
        if not self._items:
            raise IndexError("dequeue from empty queue")
        return self._items.popleft()

if __name__ == "__main__":
    q = Queue()
    q.enqueue(10); q.enqueue(20)
    print(q.dequeue())
