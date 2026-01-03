class MinStack:
    def __init__(self):
        self.stack = []
        self.minimums = []

    def push(self, value):
        self.stack.append(value)
        self.minimums.append(value if not self.minimums else min(value, self.minimums[-1]))

    def pop(self):
        self.minimums.pop()
        return self.stack.pop()

    def get_min(self):
        if not self.stack:
            raise IndexError("empty stack")
        return self.minimums[-1]

if __name__ == "__main__":
    s = MinStack()
    for x in [5, 2, 8, 1]:
        s.push(x)
    print(s.get_min())
