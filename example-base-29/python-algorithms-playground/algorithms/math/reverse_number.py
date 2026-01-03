def reverse_number(n):
    sign = -1 if n < 0 else 1
    return sign * int(str(abs(n))[::-1])

if __name__ == "__main__":
    print(reverse_number(-12340))
