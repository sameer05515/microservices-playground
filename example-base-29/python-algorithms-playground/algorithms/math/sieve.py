def primes_up_to(n):
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0:2] = [False, False]
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for multiple in range(p * p, n + 1, p):
                is_prime[multiple] = False
        p += 1
    return [i for i, value in enumerate(is_prime) if value]

if __name__ == "__main__":
    print(primes_up_to(30))
