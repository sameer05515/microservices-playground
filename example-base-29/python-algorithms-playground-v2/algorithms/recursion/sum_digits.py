def sum_digits(n):
    n = abs(n)
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)

if __name__ == "__main__":
    print(sum_digits(12345))
