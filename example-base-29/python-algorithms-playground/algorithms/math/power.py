def power(base, exponent):
    if exponent < 0:
        return 1 / power(base, -exponent)
    result = 1
    while exponent:
        if exponent & 1:
            result *= base
        base *= base
        exponent >>= 1
    return result

if __name__ == "__main__":
    print(power(2, 10))
