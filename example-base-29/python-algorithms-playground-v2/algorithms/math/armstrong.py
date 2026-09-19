def is_armstrong(n):
    if n < 0:
        return False
    digits = [int(d) for d in str(n)]
    power = len(digits)
    return sum(d ** power for d in digits) == n

if __name__ == "__main__":
    print(is_armstrong(153))
